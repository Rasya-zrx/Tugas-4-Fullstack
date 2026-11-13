import type { Request, Response } from 'express';
import { AuditService } from '../services/auditService.ts';

export class AuditController {
  private auditService: AuditService;

  constructor(
    auditService: AuditService = new AuditService()
  ) {
    this.auditService = auditService;
  }

  private handleError(res: Response, error: unknown) {
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : error,
    });
  }

  getAuditLogs = async (req: Request, res: Response) => {
    try {
      const data = await this.auditService.getAllAuditLogs();

      return res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createAuditLog = async (req: Request, res: Response) => {
    try {
      const data = await this.auditService.createAuditLog(req.body);

      return res.status(201).json({
        status: 'success',
        message: 'Audit log berhasil dibuat',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}