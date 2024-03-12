import { Test, TestingModule } from '@nestjs/testing';
import { AdminHostController } from './admin-host.controller';
import { AdminHostService } from './admin-host.service';

describe('AdminHostController', () => {
  let controller: AdminHostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminHostController],
      providers: [AdminHostService],
    }).compile();

    controller = module.get<AdminHostController>(AdminHostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
