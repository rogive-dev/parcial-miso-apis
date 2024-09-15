import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadService } from './ciudad.service';
import { CiudadController } from './ciudad.controller';
import { CiudadEntity } from './ciudad.entity/ciudad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity])],
  providers: [CiudadService],
  controllers: [CiudadController],
  exports: [CiudadService],
})
export class CiudadModule {}

