import express from 'express';
const router = express.Router();
// const { registerUser, loginUser } = require('../controllers/authController');
import func from '../controllers/authController.js';

router.post('/register', func.registerUser);
router.post('/login', func.loginUser);

export default router;
