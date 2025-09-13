import { Router } from 'express';
import { UploadController } from '../controllers/uploadController';
import { authenticateToken } from '../middleware/auth';
import { upload, handleUploadError } from '../middleware/upload';

const router = Router();

router.use(authenticateToken);

router.post('/', upload.single('file'), handleUploadError, UploadController.uploadFile);
router.get('/:filename', UploadController.getFile);
router.delete('/:filename', UploadController.deleteFile);

export default router;