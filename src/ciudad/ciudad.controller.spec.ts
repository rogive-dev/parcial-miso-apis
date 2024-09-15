import { Test, TestingModule } from '@nestjs/testing';
import { CiudadController } from './ciudad.controller';
import { CiudadService } from './ciudad.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity/ciudad.entity';
import { Repository } from 'typeorm';

describe('CiudadController', () => {
  let controller: CiudadController;
  let service: CiudadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CiudadController],
      providers: [
        CiudadService,
        {
          provide: getRepositoryToken(CiudadEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<CiudadController>(CiudadController);
    service = module.get<CiudadService>(CiudadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
