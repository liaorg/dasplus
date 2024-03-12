import { Test, TestingModule } from '@nestjs/testing';
import { TimeConfigureController } from './time-configure.controller';
import { TimeConfigureService } from './time-configure.service';

describe('TimeConfigureController', () => {
  let controller: TimeConfigureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeConfigureController],
      providers: [TimeConfigureService],
    }).compile();

    controller = module.get<TimeConfigureController>(TimeConfigureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
