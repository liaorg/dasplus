import { Test, TestingModule } from '@nestjs/testing';
import { DesensitizationController } from './desensitization.controller';
import { DesensitizationService } from './desensitization.service';

describe('DesensitizationController', () => {
    let controller: DesensitizationController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DesensitizationController],
            providers: [DesensitizationService],
        }).compile();

        controller = module.get<DesensitizationController>(DesensitizationController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
