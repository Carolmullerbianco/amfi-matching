import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken, validateAmfiEmail } from '../middleware/auth';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', validateAmfiEmail, AuthController.register);
router.get('/me', authenticateToken, AuthController.me);

export default router;