import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiudadEntity } from 'src/ciudad/ciudad.entity/ciudad.entity';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity/supermercado.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class CiudadSupermercadoService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,

        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>,
    ) {}

    async addSupermarketCity(ciudadId: string, supermercadoId: string): Promise<CiudadEntity> {
        const ciudad = await this.ciudadRepository.findOne({
            where: { id: ciudadId },
            relations: ['supermercados'],
        });
        if (!ciudad) {
            throw new BusinessLogicException("City not found", BusinessError.NOT_FOUND);
        }

        const supermercado = await this.supermercadoRepository.findOne({
            where: { id: supermercadoId },
        });
        if (!supermercado) {
            throw new BusinessLogicException("Supermarket not found", BusinessError.NOT_FOUND);
        }

        ciudad.supermercados.push(supermercado);
        return await this.ciudadRepository.save(ciudad);
    }

    async findSupermarketsFromCity(ciudadId: string): Promise<SupermercadoEntity[]> {
        const ciudad = await this.ciudadRepository.findOne({
            where: { id: ciudadId },
            relations: ['supermercados'],
        });
        if (!ciudad) {
            throw new BusinessLogicException("City not found", BusinessError.NOT_FOUND);
        }
        return ciudad.supermercados;
    }

    async findSupermarketFromCity(ciudadId: string, supermercadoId: string): Promise<SupermercadoEntity> {
        const ciudad = await this.ciudadRepository.findOne({
            where: { id: ciudadId },
            relations: ['supermercados'],
        });
        if (!ciudad) {
            throw new BusinessLogicException("City not found", BusinessError.NOT_FOUND);
        }

        const supermercado = ciudad.supermercados.find(s => s.id === supermercadoId);
        if (!supermercado) {
            throw new BusinessLogicException("Supermarket not found in the city", BusinessError.NOT_FOUND);
        }

        return supermercado;
    }

    async updateSupermarketsFromCity(ciudadId: string, supermercados: SupermercadoEntity[]): Promise<CiudadEntity> {
        const ciudad = await this.ciudadRepository.findOne({
            where: { id: ciudadId },
            relations: ['supermercados'],
        });
        if (!ciudad) {
            throw new BusinessLogicException("City not found", BusinessError.NOT_FOUND);
        }

        ciudad.supermercados = supermercados;
        return await this.ciudadRepository.save(ciudad);
    }

    async deleteSupermarketFromCity(ciudadId: string, supermercadoId: string): Promise<void> {
        const ciudad = await this.ciudadRepository.findOne({
            where: { id: ciudadId },
            relations: ['supermercados'],
        });
        if (!ciudad) {
            throw new BusinessLogicException("City not found", BusinessError.NOT_FOUND);
        }

        ciudad.supermercados = ciudad.supermercados.filter(s => s.id !== supermercadoId);
        await this.ciudadRepository.save(ciudad);
    }
}


