import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CiudadEntity } from 'src/ciudad/ciudad.entity/ciudad.entity';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity/supermercado.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let supermercadoList: SupermercadoEntity[];

  const seedDatabase = async () => {
    await supermercadoRepository.clear();
    await ciudadRepository.clear();

    supermercadoList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado = await supermercadoRepository.save({
        name: 'Supermarket Super Extra XYZ',
        longitude: faker.number.float(),
        latitude: faker.number.float(),
        website: faker.internet.url(),
      });
      supermercadoList.push(supermercado);
    }

    ciudad = await ciudadRepository.save({
      name: faker.location.city(),
      country: 'Argentina',
      population: faker.number.int(),
      supermercados: supermercadoList,
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketCity should add a supermarket to a city', async () => {
    const newSupermarket: SupermercadoEntity = await supermercadoRepository.save({
      name: 'Supermarket Super Extra XYZ',
      longitude: faker.number.float(),
      latitude: faker.number.float(),
      website: faker.internet.url(),
    });

    const newCity: CiudadEntity = await ciudadRepository.save({
      name: faker.location.city(),
      country: 'Ecuador',
      population: faker.number.int(),
    });

    const result = await service.addSupermarketCity(newCity.id, newSupermarket.id);

    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].name).toBe(newSupermarket.name);
    expect(result.supermercados[0].website).toBe(newSupermarket.website);
  });

  it('addSupermarketCity should throw an exception for an invalid supermarket', async () => {
    const newCity: CiudadEntity = await ciudadRepository.save({
      name: faker.location.city(),
      country: 'Ecuador',
      population: faker.number.int(),
    });

    await expect(() => service.addSupermarketCity(newCity.id, '0')).rejects.toHaveProperty(
      'message',
      'Invalid UUID format'
    );
  });

  it('findSupermarketsFromCity should return supermarkets from a city', async () => {
    const supermercados = await service.findSupermarketsFromCity(ciudad.id);
    expect(supermercados.length).toBe(5);
  });

  it('findSupermarketFromCity should return a supermarket from a city', async () => {
    const supermercado = supermercadoList[0];
    const result = await service.findSupermarketFromCity(ciudad.id, supermercado.id);
    expect(result).not.toBeNull();
    expect(result.name).toBe(supermercado.name);
  });

  it('findSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findSupermarketFromCity(ciudad.id, '0')).rejects.toHaveProperty(
      'message',
      'Invalid UUID format'
    );
  });

  it('updateSupermarketsFromCity should update supermarkets for a city', async () => {
    const newSupermarket: SupermercadoEntity = await supermercadoRepository.save({
      name: 'Supermarket Super Extra XYZ',
      longitude: faker.number.float(),
      latitude: faker.number.float(),
      website: faker.internet.url(),
    });

    const updatedCity = await service.updateSupermarketsFromCity(ciudad.id, [newSupermarket]);
    expect(updatedCity.supermercados.length).toBe(1);
    expect(updatedCity.supermercados[0].name).toBe(newSupermarket.name);
  });

  it('deleteSupermarketFromCity should remove a supermarket from a city', async () => {
    const supermercado = supermercadoList[0];

    await service.deleteSupermarketFromCity(ciudad.id, supermercado.id);

    const storedCity = await ciudadRepository.findOne({
      where: { id: ciudad.id },
      relations: ['supermercados'],
    });

    const deletedSupermarket = storedCity.supermercados.find((s) => s.id === supermercado.id);
    expect(deletedSupermarket).toBeUndefined();
  });
});
