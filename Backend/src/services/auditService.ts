import {
  AuditRepository,
  type CreateAuditLogInput,
} from '../repositories/auditRepository.ts';

export class AuditService {
  private auditRepository: AuditRepository;

  constructor(
    auditRepository: AuditRepository = new AuditRepository()
  ) {
    this.auditRepository = auditRepository;
  }

  async getAllAuditLogs() {
    return await this.auditRepository.findAll();
  }

  async createAuditLog(input: CreateAuditLogInput) {
    return await this.auditRepository.create(input);
  }
}