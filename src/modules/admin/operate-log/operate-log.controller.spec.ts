import { Test, TestingModule } from '@nestjs/testing';
import { OperateLogController } from './operate-log.controller';
import { OperateLogService } from './operate-log.service';

describe('OperateLogController', () => {
  let controller: OperateLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperateLogController],
      providers: [OperateLogService],
    }).compile();

    controller = module.get<OperateLogController>(OperateLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
