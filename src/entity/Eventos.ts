import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, ManyToOne } from "typeorm"
import { User } from "./User";

export enum EnumStatus {
    ABERTO = 'aberto',
    CHEIO = 'cheio',
    FECHADO = 'fechado',
  }
@Entity()
export class Evento {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nome: string;

    @Column()
    quantidadeDeHoras: number;

    @Column()
    quantidadeDeVagas: number;
    
    @ManyToOne(() => User, (user) => user.eventos)
    user: User

    @Column({
        type: 'enum',
        enum: EnumStatus,
        default: EnumStatus.ABERTO,
    })
    status: EnumStatus;
}
