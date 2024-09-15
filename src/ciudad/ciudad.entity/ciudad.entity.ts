import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity/supermercado.entity';

@Entity()
export class CiudadEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
    
    @Column()
    country: string;

    @Column()
    population: number;

    @ManyToMany(() => SupermercadoEntity, supermercado => supermercado.ciudades)
    @JoinTable()
    supermercados: SupermercadoEntity[];
}
