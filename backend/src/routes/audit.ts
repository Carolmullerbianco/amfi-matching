import { Router } from 'express';
import { AuditController } from '../controllers/auditController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', AuditController.getHistory);
router.get('/:table_name/:record_id', AuditController.getRecordHistory);

export default router;