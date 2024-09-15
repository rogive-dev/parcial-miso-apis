import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity/supermercado.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class SupermercadoService {
    constructor(
        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>,
    ) {}

    async findAll(): Promise<SupermercadoEntity[]> {
        return await this.supermercadoRepository.find({ relations: ['ciudades'] });
    }

    async findOne(id: string): Promise<SupermercadoEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({
            where: { id },
            relations: ['ciudades'],
        });
        if (!supermercado) {
            throw new BusinessLogicException("The supermarket with the given id was not found", BusinessError.NOT_FOUND);
        }
        return supermercado;
    }

    async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        this.validateName(supermercado.name);
        return await this.supermercadoRepository.save(supermercado);
    }

    async update(id: string, supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        const persistedSupermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({ where: { id } });
        if (!persistedSupermercado) {
            throw new BusinessLogicException("The supermarket with the given id was not found", BusinessError.NOT_FOUND);
        }

        this.validateName(supermercado.name);
        return await this.supermercadoRepository.save({ ...persistedSupermercado, ...supermercado });
    }

    async delete(id: string) {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({ where: { id } });
        if (!supermercado) {
            throw new BusinessLogicException("The supermarket with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.supermercadoRepository.remove(supermercado);
    }

    private validateName(name: string): void {
        if (name.length <= 10) {
            throw new BusinessLogicException('Supermarket name must be longer than 10 characters.', BusinessError.BAD_REQUEST);
        }
    }
}


