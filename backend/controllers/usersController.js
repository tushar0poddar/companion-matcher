import { sql } from '../config/db.js';

// GET /users/matches/:username
const getMatches = async (req, res) => {
  const { username } = req.params;

  try {
    const [user] = await sql`
      SELECT u.name, u.age, array_agg(ui.interest) AS interests
      FROM Users u
      JOIN UserInterest ui ON u.id = ui.user_id
      WHERE u.name = ${username}
      GROUP BY u.id
    `;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const matches = await sql`
      SELECT u.name, u.age, array_agg(ui.interest) AS interests
      FROM Users u
      JOIN UserInterest ui ON u.id = ui.user_id
      WHERE u.name != ${username}
      AND EXISTS (
        SELECT 1 FROM UserInterest ui2
        WHERE ui2.user_id = u.id AND ui2.interest = ANY(${user.interests})
      )
      GROUP BY u.id
    `;

    res.json(matches);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Read Profile
const getUserProfile = async (req, res) => {
  const { authUserId } = req.params;

  try {
    const result = await sql`
      SELECT u.name, u.age, array_agg(ui.interest) AS interests
      FROM Users u 
      JOIN UserInterest ui ON u.id = ui.user_id
      WHERE u.id = ${authUserId}
      GROUP BY u.id
    `
    if (result.length === 0)
      return res.status(404).json({ error: 'Profile not found' });

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving profile' });
  }
};

// ✅ Update Profile
const updateUserProfile = async (req, res) => {
  const { authUserId } = req.params;
  const { name, age, interests } = req.body;

  try {
    await sql`
      UPDATE Users
      SET name = ${name}, age = ${age}
      WHERE id = ${authUserId}
    `;
    await sql`
      DELETE FROM UserInterest WHERE user_id = ${authUserId}
    `
    for (const interest of interests) {
      await sql`
        INSERT INTO UserInterest (user_id, interest)
        VALUES (${authUserId}, ${interest})
      `;
    }

    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
};

// ✅ Delete Profile
const deleteUserProfile = async (req, res) => {
  const { authUserId } = req.params;

  try {
    // await pool.query('DELETE FROM users WHERE id = $1', [authUserId]);
    await sql`
      DELETE FROM Users WHERE id = ${authUserId}
    `;
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
};

// ✅ Utility: Admin-only
const getAllUsers = async (req, res) => {
  try {
    const result = await sql`
      SELECT u.id, u.name, u.age, a.email, array_agg(ui.interest) AS interests
      FROM Users u
      JOIN AuthUsers a ON u.id = a.id
      LEFT JOIN UserInterest ui ON u.id = ui.user_id
      GROUP BY u.id, a.email
    `;
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    // const result = await pool.query(
    //   'SELECT u.* FROM users u JOIN auth_users a ON u.id = a.id WHERE a.username = $1',
    //   [username]
    // );
    const result = await sql`
      SELECT u.id, u.name, u.age, a.email, array_agg(ui.interest) AS interests
      FROM Users u
      JOIN AuthUsers a ON u.id = a.id
      LEFT JOIN UserInterest ui ON u.id = ui.user_id
      WHERE u.name = ${username}
      GROUP BY u.id, a.email
    `;

    if (result.length === 0)
      return res.status(404).json({ error: 'User not found' });

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user by username' });
  }
};

export default {
  getMatches,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllUsers,
  getUserByUsername
};
