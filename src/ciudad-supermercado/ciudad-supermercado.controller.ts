import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { SupermercadoDto } from 'src/supermercado/supermercado.dto/supermercado.dto';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity/supermercado.entity';

@Controller('cities/:cityId/supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
  constructor(private readonly ciudadSupermercadoService: CiudadSupermercadoService) {}

  @Post(':supermarketId')
  async addSupermarketCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string
  ) {
    return await this.ciudadSupermercadoService.addSupermarketCity(cityId, supermarketId);
  }

  @Get()
  async findSupermarketsFromCity(@Param('cityId') cityId: string): Promise<SupermercadoEntity[]> {
    return await this.ciudadSupermercadoService.findSupermarketsFromCity(cityId);
  }

  @Get(':supermarketId')
  async findSupermarketFromCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string
  ): Promise<SupermercadoEntity> {
    return await this.ciudadSupermercadoService.findSupermarketFromCity(cityId, supermarketId);
  }

  @Put()
  async updateSupermarketsFromCity(
    @Param('cityId') cityId: string,
    @Body() supermercadosDto: SupermercadoDto[],
  ) {
    const supermercados = plainToInstance(SupermercadoEntity, supermercadosDto);
    return await this.ciudadSupermercadoService.updateSupermarketsFromCity(cityId, supermercados);
  }

  @Delete(':supermarketId')
  @HttpCode(204)
  async deleteSupermarketFromCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string
  ) {
    return await this.ciudadSupermercadoService.deleteSupermarketFromCity(cityId, supermarketId);
  }
}


