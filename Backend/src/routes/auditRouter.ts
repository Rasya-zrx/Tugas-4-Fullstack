import { Router } from 'express';
import { AuditController } from '../controllers/auditController.ts';

const auditRouter = Router();

const auditController = new AuditController();

auditRouter.get('/', (req, res) =>
  auditController.getAuditLogs(req, res)
);

auditRouter.post('/', (req, res) =>
  auditController.createAuditLog(req, res)
);

export { auditRouter };