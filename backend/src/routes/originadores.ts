import { Router } from 'express';
import { OriginadorController } from '../controllers/originadorController';
import { authenticateToken } from '../middleware/auth';
import { upload, handleUploadError } from '../middleware/upload';

const router = Router();

router.use(authenticateToken);

router.get('/', OriginadorController.list);
router.get('/:id', OriginadorController.getById);
router.post('/', upload.single('arquivo_elegibilidade'), handleUploadError, OriginadorController.create);
router.put('/:id', upload.single('arquivo_elegibilidade'), handleUploadError, OriginadorController.update);
router.delete('/:id', OriginadorController.delete);

export default router;