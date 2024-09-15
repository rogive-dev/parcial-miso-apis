import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { CiudadEntity } from 'src/ciudad/ciudad.entity/ciudad.entity';

@Entity()
export class SupermercadoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('float')
  longitude: number;

  @Column('float')
  latitude: number;

  @Column()
  website: string;

  @ManyToMany(() => CiudadEntity, ciudad => ciudad.supermercados)
  ciudades: CiudadEntity[];
}
