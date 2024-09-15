import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiudadEntity } from 'src/ciudad/ciudad.entity/ciudad.entity';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity/supermercado.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { isUUID } from 'class-validator';

@Injectable()
export class CiudadSupermercadoService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,

        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>,
    ) {}

    async addSupermarketCity(ciudadId: string, supermercadoId: string): Promise<CiudadEntity> {
        if (!isUUID(ciudadId) || !isUUID(supermercadoId)) {
            throw new BusinessLogicException("Invalid UUID format", BusinessError.PRECONDITION_FAILED);
        }

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
        if (!isUUID(ciudadId)) {
            throw new BusinessLogicException("Invalid UUID format", BusinessError.PRECONDITION_FAILED);
        }

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
        if (!isUUID(ciudadId) || !isUUID(supermercadoId)) {
            throw new BusinessLogicException("Invalid UUID format", BusinessError.PRECONDITION_FAILED);
        }

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

    async updateSupermarketsFromCity(ciudadId: string, supermercados: SupermercadoEntity[] | SupermercadoEntity): Promise<CiudadEntity> {
        if (!isUUID(ciudadId)) {
            throw new BusinessLogicException("Invalid UUID format", BusinessError.PRECONDITION_FAILED);
        }
    
        const ciudad = await this.ciudadRepository.findOne({
            where: { id: ciudadId },
            relations: ['supermercados'],
        });
        if (!ciudad) {
            throw new BusinessLogicException("City not found", BusinessError.NOT_FOUND);
        }
    
        const supermercadosArray = Array.isArray(supermercados) ? supermercados : [supermercados];
        const errores: string[] = [];
    
        await Promise.all(
            supermercadosArray.map(async (supermercado) => {
                if (!isUUID(supermercado.id)) {
                    errores.push(`Supermarket ID ${supermercado.id} is not a valid UUID`);
                    return;
                }
    
                const supermercadoExistente = await this.supermercadoRepository.findOne({
                    where: { id: supermercado.id },
                });
    
                if (!supermercadoExistente) {
                    errores.push(`Supermarket with id ${supermercado.id} not found`);
                }
            })
        );
    
        if (errores.length > 0) {
            throw new BusinessLogicException(errores.join(', '), BusinessError.PRECONDITION_FAILED);
        }
    
        ciudad.supermercados = supermercadosArray;
        return await this.ciudadRepository.save(ciudad);
    }
    
    async deleteSupermarketFromCity(ciudadId: string, supermercadoId: string): Promise<void> {
        if (!isUUID(ciudadId) || !isUUID(supermercadoId)) {
            throw new BusinessLogicException("Invalid UUID format", BusinessError.PRECONDITION_FAILED);
        }

        const ciudad = await this.ciudadRepository.findOne({
            where: { id: ciudadId },
            relations: ['supermercados'],
        });
        if (!ciudad) {
            throw new BusinessLogicException("City not found", BusinessError.NOT_FOUND);
        }
    
        const supermercadoAsociado = ciudad.supermercados.find(supermercado => supermercado.id === supermercadoId);
        if (!supermercadoAsociado) {
            throw new BusinessLogicException("Supermarket not associated with the city", BusinessError.PRECONDITION_FAILED);
        }
    
        ciudad.supermercados = ciudad.supermercados.filter(supermercado => supermercado.id !== supermercadoId);
        await this.ciudadRepository.save(ciudad);
    }
}


