import { Router } from 'express';
import { InvestidorController } from '../controllers/investidorController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', InvestidorController.list);
router.get('/:id', InvestidorController.getById);
router.post('/', InvestidorController.create);
router.put('/:id', InvestidorController.update);
router.delete('/:id', InvestidorController.delete);

export default router;