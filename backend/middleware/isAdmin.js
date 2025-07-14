import {sql} from '../config/db.js';

const isAdmin = async (req, res, next) => {
  const { id } = req.query; // or from headers/session in real-world

  if (!id) return res.status(403).json({ error: 'User ID missing' });

  try {
    const result = await sql`
        SELECT is_admin FROM AuthUsers WHERE id = ${id}
    `

    if (!result[0]?.is_admin) {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Authorization check failed' });
  }
};

export default isAdmin;
