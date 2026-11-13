import type { Request, Response } from 'express';
import { FlagService } from '../services/flagService.ts';

export class FlagController {
  private flagService: FlagService;

  constructor(
    flagService: FlagService = new FlagService()
  ) {
    this.flagService = flagService;
  }

  private handleError(res: Response, error: unknown) {
    if (
      error instanceof Error &&
      error.message === 'FLAG_NOT_FOUND'
    ) {
      return res.status(404).json({
        status: 'fail',
        message: 'Flag tidak ditemukan',
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : error,
    });
  }

  getFlags = async (req: Request, res: Response) => {
    try {
      const data = await this.flagService.getAllFlags();

      return res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  updateFlagStatus = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      const data = await this.flagService.updateFlagStatus(
        id,
        status
      );

      return res.status(200).json({
        status: 'success',
        message: 'Status flag berhasil diperbarui',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}