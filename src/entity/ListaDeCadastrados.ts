import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, ManyToOne } from "typeorm"

export enum EnumStatus {
    ABERTO = 'aberto',
    CHEIO = 'cheio',
    FECHADO = 'fechado',
  }
@Entity()
export class ListaDeCadastrados {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    usuario: string;

    @Column()
    evento: string;

}
