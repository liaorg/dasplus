import { Test, TestingModule } from '@nestjs/testing';
import { DesensitizationService } from './desensitization.service';

describe('DesensitizationService', () => {
    let service: DesensitizationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DesensitizationService],
        }).compile();

        service = module.get<DesensitizationService>(DesensitizationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
