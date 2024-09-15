import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoController } from './supermercado.controller';
import { SupermercadoService } from './supermercado.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupermercadoEntity } from './supermercado.entity/supermercado.entity';
import { Repository } from 'typeorm';

describe('SupermercadoController', () => {
  let controller: SupermercadoController;
  let service: SupermercadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupermercadoController],
      providers: [
        SupermercadoService,
        {
          provide: getRepositoryToken(SupermercadoEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<SupermercadoController>(SupermercadoController);
    service = module.get<SupermercadoService>(SupermercadoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
