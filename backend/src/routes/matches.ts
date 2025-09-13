import { Router } from 'express';
import { MatchController } from '../controllers/matchController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', MatchController.getMatches);
router.get('/stats', MatchController.getMatchStats);

export default router;