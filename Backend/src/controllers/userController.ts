import type { Request, Response } from 'express';
import { UserService } from '../services/userService.ts';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }

  private handleError(res: Response, error: unknown) {
    if (
      error instanceof Error &&
      error.message === 'EMAIL_ALREADY_EXISTS'
    ) {
      return res.status(409).json({
        status: 'fail',
        message: 'Email sudah digunakan',
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : error,
    });
  }

  getUsers = async (req: Request, res: Response) => {
    try {
      const data = await this.userService.getAllUsers();

      return res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const data = await this.userService.createUser(req.body);

      return res.status(201).json({
        status: 'success',
        message: 'User berhasil dibuat',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}