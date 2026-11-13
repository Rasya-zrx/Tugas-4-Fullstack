import { FlagRepository } from '../repositories/flagRepository.ts';

export class FlagService {
  private flagRepository: FlagRepository;

  constructor(
    flagRepository: FlagRepository = new FlagRepository()
  ) {
    this.flagRepository = flagRepository;
  }

  async getAllFlags() {
    return await this.flagRepository.findAll();
  }

  async updateFlagStatus(id: number, status: string) {
    const existingFlag = await this.flagRepository.findById(id);

    if (!existingFlag) {
      throw new Error('FLAG_NOT_FOUND');
    }

    return await this.flagRepository.updateStatus(id, status);
  }
}