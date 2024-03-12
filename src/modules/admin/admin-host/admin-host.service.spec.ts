import { Test, TestingModule } from '@nestjs/testing';
import { AdminHostService } from './admin-host.service';

describe('AdminHostService', () => {
  let service: AdminHostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminHostService],
    }).compile();

    service = module.get<AdminHostService>(AdminHostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
