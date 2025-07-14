import dotenv from 'dotenv';
import {sql} from '../config/db.js';
import bcrypt from 'bcrypt';

dotenv.config();

const registerUser = async (req, res) => {
  const {email, password, name, age, interests } = req.body;

  if (!email || !password || !name || !age || !interests) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Step 1: Check if user already exists
    const existing = await sql`
      SELECT * FROM AuthUsers WHERE email = ${email} OR id = (SELECT id FROM Users WHERE name = ${name})
    `;

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Step 2: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Insert into auth_users
    const authResult = await sql`
      INSERT INTO AuthUsers (email, password)
      VALUES (${email}, ${hashedPassword})
      RETURNING id
    `;
    if ((email === process.env.ADMIN_EMAIL) && (password === process.env.ADMIN_PASSWORD)) {
      await sql`
        UPDATE AuthUsers SET is_admin = TRUE WHERE id = ${authResult[0].id}
      `;
    }

    const authUserId = authResult[0].id;

    // Step 4: Insert into users (profile)
    const userResult = await sql`
      INSERT INTO Users (id, name, age)
      VALUES (${authUserId}, ${name}, ${age})
      RETURNING id
    `;
    const userId = userResult[0].id;

    for (const interest of interests) {
      await sql`
        INSERT INTO UserInterest (user_id, interest)
        VALUES (${userId}, ${interest})
      `;
    }

    res.status(201).json({ message: 'User registered and profile created successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  try {
    // Step 1: Get user by email
    const result = await sql`
      SELECT * FROM AuthUsers WHERE email = ${email}
    `

    if (result.length === 0)
      return res.status(401).json({ error: 'User not found' });

    const user = result[0];

    // Step 2: Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ error: 'Invalid password' });

    const profile = await sql`
      SELECT u.name, u.age, array_agg(ui.interest) AS interests
      FROM Users u
      LEFT JOIN UserInterest ui ON u.id = ui.user_id
      WHERE u.id = ${user.id}
      GROUP BY u.id
    `;

    // Step 3: Successful login
    res.json({
      message: 'Login successful',
      username: profile[0].name,
      id: user.id // return ID to use in frontend or further queries
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

export default {
  loginUser,
  registerUser 
};