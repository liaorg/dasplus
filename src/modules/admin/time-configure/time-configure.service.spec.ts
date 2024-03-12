import { Test, TestingModule } from '@nestjs/testing';
import { TimeConfigureService } from './time-configure.service';

describe('TimeConfigureService', () => {
  let service: TimeConfigureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeConfigureService],
    }).compile();

    service = module.get<TimeConfigureService>(TimeConfigureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
