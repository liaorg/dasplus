import { Test, TestingModule } from '@nestjs/testing';
import { SecurityConfigureService } from './security-configure.service';

describe('SecurityConfigureService', () => {
  let service: SecurityConfigureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityConfigureService],
    }).compile();

    service = module.get<SecurityConfigureService>(SecurityConfigureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
