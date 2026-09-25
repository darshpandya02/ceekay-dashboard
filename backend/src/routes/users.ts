import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all users (Admin only)
router.get('/', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create user (Admin only)
router.post('/', requireAdmin, [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['ADMIN', 'USER']),
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    logger.info(`User ${email} created by admin ${req.user?.email}`);

    res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user (Admin only)
router.put('/:id', requireAdmin, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('role').optional().isIn(['ADMIN', 'USER']),
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { id } = req.params;
    const { name, email, role } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email }
      });

      if (emailTaken) {
        return res.status(400).json({ error: 'Email already taken' });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role })
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });

    logger.info(`User ${id} updated by admin ${req.user?.email}`);

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (Admin only)
router.delete('/:id', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (id === req.user?.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    });

    logger.info(`User ${id} deleted by admin ${req.user?.email}`);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
