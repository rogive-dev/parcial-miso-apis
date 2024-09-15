import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from './ciudad.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity/ciudad.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadList: CiudadEntity[];

  const seedDatabase = async () => {
    await repository.clear();
    ciudadList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad = await repository.save({
        name: faker.location.city(),
        country: 'Argentina',
        population: faker.number.int(),
      });
      ciudadList.push(ciudad);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cities', async () => {
    const cities = await service.findAll();
    expect(cities).not.toBeNull();
    expect(cities).toHaveLength(ciudadList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCity = ciudadList[0];
    const city = await service.findOne(storedCity.id);
    expect(city).not.toBeNull();
    expect(city.name).toEqual(storedCity.name);
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty('message', 'Invalid UUID format: 0');
  });

  it('create should return a new city', async () => {
    const city: CiudadEntity = {
      id: '',
      name: faker.location.city(),
      country: 'Ecuador',
      population: faker.number.int(),
      supermercados: [],
    };
    const newCity = await service.create(city);
    expect(newCity).not.toBeNull();

    const storedCity = await repository.findOne({ where: { id: newCity.id } });
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(newCity.name);
  });

  it('update should modify a city', async () => {
    const city = ciudadList[0];
    city.name = 'New name';
    const updatedCity = await service.update(city.id, city);
    expect(updatedCity).not.toBeNull();

    const storedCity = await repository.findOne({ where: { id: city.id } });
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(city.name);
  });

  it('delete should remove a city', async () => {
    const city = ciudadList[0];
    await service.delete(city.id);
    const deletedCity = await repository.findOne({ where: { id: city.id } });
    expect(deletedCity).toBeNull();
  });
});
