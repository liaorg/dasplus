import { Test, TestingModule } from '@nestjs/testing';
import { SecurityConfigureController } from './security-configure.controller';
import { SecurityConfigureService } from './security-configure.service';

describe('SecurityConfigureController', () => {
  let controller: SecurityConfigureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityConfigureController],
      providers: [SecurityConfigureService],
    }).compile();

    controller = module.get<SecurityConfigureController>(SecurityConfigureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
