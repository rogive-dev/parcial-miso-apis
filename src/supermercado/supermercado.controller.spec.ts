import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoController } from './supermercado.controller';

describe('SupermercadoController', () => {
  let controller: SupermercadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupermercadoController],
    }).compile();

    controller = module.get<SupermercadoController>(SupermercadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
