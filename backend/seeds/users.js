import { sql } from '../config/db.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '/sample_data.json');

const seedUsers = async () => {
  const rawData = fs.readFileSync(filePath);
  const users = JSON.parse(rawData);

  
  try {
    for (const user of users) {
      // 1. Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // 2. Insert into auth_users
      const authResult = await sql`
        INSERT INTO AuthUsers (email, password)
        VALUES (${user.email}, ${hashedPassword})
        RETURNING id
      `;
      console.log(authResult);

      // const authUserId = authResult.rows[0].id;
      const authUserId = authResult[0].id;
      console.log('Auth User ID:', authUserId);
      

      // 3. Insert profile into users table
      const userResult = await sql`
        INSERT INTO Users (id, name, age)
        VALUES (${authUserId}, ${user.name}, ${user.age})
        RETURNING id
      `;
      console.log(userResult);
      

      // const userId = userResult.rows[0].id;
      const userId = userResult[0].id;
      console.log('User ID:', userId);
      

      // 4. Insert interests into user_interest
      for (const interest of user.interests) {
        await sql`
          INSERT INTO UserInterest (user_id, interest)
          VALUES (${userId}, ${interest})
        `;
      }
    }

    console.log('✅ Sample users seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error while seeding:', err);
    process.exit(1);
  }
};

seedUsers();
