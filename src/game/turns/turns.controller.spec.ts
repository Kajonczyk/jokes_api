import { Test, TestingModule } from '@nestjs/testing';
import { TurnsController } from './turns.controller';

describe('TurnsController', () => {
  let controller: TurnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TurnsController],
    }).compile();

    controller = module.get<TurnsController>(TurnsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
