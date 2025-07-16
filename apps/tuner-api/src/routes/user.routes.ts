import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const router = Router();

router.post('/', userController.createUser);        // Create a new user
router.get('/', userController.getUsers);           // Get all users
router.get('/:id', userController.getUserById);     // Get user by ID
router.put('/:id', userController.updateUser);      // Update user by ID
router.delete('/:id', userController.deleteUser);   // Delete user by ID

export default router;
