import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { CiudadEntity } from 'src/ciudad/ciudad.entity/ciudad.entity';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity/supermercado.entity';
import { CiudadSupermercadoController } from './ciudad-supermercado.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity]),
  ],
  providers: [CiudadSupermercadoService],
  controllers: [CiudadSupermercadoController],
})
export class CiudadSupermercadoModule {}
