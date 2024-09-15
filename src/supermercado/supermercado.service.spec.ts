import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoService } from './supermercado.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupermercadoEntity } from './supermercado.entity/supermercado.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadoList: SupermercadoEntity[];

  const seedDatabase = async () => {
    await repository.clear();
    supermercadoList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado = await repository.save({
        name: 'Supermarket Super Extra XYZ',
        longitude: faker.number.float(),
        latitude: faker.number.float(),
        website: faker.internet.url(),
      });
      supermercadoList.push(supermercado);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermarkets', async () => {
    const supermercados = await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(supermercadoList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermarket = supermercadoList[0];
    const supermarket = await service.findOne(storedSupermarket.id);
    expect(supermarket).not.toBeNull();
    expect(supermarket.name).toEqual(storedSupermarket.name);
  });

  it('create should return a new supermarket', async () => {
    const supermarket: SupermercadoEntity = {
      id: '',
      name: 'Supermarket Super Extra XYZ',
      longitude: faker.number.float(),
      latitude: faker.number.float(),
      website: faker.internet.url(),
      ciudades: [],
    };
    const newSupermarket = await service.create(supermarket);
    expect(newSupermarket).not.toBeNull();

    const storedSupermarket = await repository.findOne({ where: { id: newSupermarket.id } });
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(newSupermarket.name);
  });

it('update should modify a supermarket', async () => {
  try {
    const supermarket = supermercadoList[0];
    supermarket.name = 'New Supermarket Name';
    const updatedSupermarket = await service.update(supermarket.id, supermarket);
    expect(updatedSupermarket).not.toBeNull();

    const storedSupermarket = await repository.findOne({ where: { id: supermarket.id } });
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(supermarket.name);
  } catch (error) {
    console.log(error);
    throw error;
  }
});


  it('delete should remove a supermarket', async () => {
    const supermarket = supermercadoList[0];
    await service.delete(supermarket.id);
    const deletedSupermarket = await repository.findOne({ where: { id: supermarket.id } });
    expect(deletedSupermarket).toBeNull();
  });
});

