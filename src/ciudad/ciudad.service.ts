import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity/ciudad.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

const validCountries = ['Argentina', 'Ecuador', 'Paraguay'];

@Injectable()
export class CiudadService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,
    ) {}

    async findAll(): Promise<CiudadEntity[]> {
        return await this.ciudadRepository.find({ relations: ['supermercados'] });
    }

    async findOne(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
            where: { id },
            relations: ["supermercados"],
        });
        if (!ciudad) {
            throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);
        }
        return ciudad;
    }

    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        this.validateCountry(ciudad.country);
        return await this.ciudadRepository.save(ciudad);
    }

    async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
        const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({ where: { id } });
        if (!persistedCiudad) {
            throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);
        }

        this.validateCountry(ciudad.country);
        return await this.ciudadRepository.save({ ...persistedCiudad, ...ciudad });
    }

    async delete(id: string) {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({ where: { id } });
        if (!ciudad) {
            throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.ciudadRepository.remove(ciudad);
    }

    private validateCountry(country: string): void {
        if (!validCountries.includes(country)) {
            throw new BusinessLogicException(`Invalid country. Only ${validCountries.join(', ')} are allowed.`, BusinessError.BAD_REQUEST);
        }
    }
}


