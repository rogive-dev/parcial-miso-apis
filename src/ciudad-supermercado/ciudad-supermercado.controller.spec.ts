import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoController } from './ciudad-supermercado.controller';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';
import { Repository } from 'typeorm';

describe('CiudadSupermercadoController', () => {
  let controller: CiudadSupermercadoController;
  let service: CiudadSupermercadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CiudadSupermercadoController],
      providers: [
        CiudadSupermercadoService,
        {
          provide: getRepositoryToken(CiudadEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(SupermercadoEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<CiudadSupermercadoController>(CiudadSupermercadoController);
    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
