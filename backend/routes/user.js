import express from 'express';
const router = express.Router();
import func from '../controllers/usersController.js';
import isAdmin from '../middleware/isAdmin.js';

router.get('/matches/:username', func.getMatches);

// Profile CRUD
router.get('/:authUserId', func.getUserProfile);
router.put('/:authUserId', func.updateUserProfile);
router.delete('/:authUserId', func.deleteUserProfile);

// Admin utilities (with admin check)
router.get('/', isAdmin, func.getAllUsers);
router.get('/by-username/:username', isAdmin, func.getUserByUsername);

export default router;