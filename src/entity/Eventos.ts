import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, ManyToOne, BeforeRecover, AfterLoad } from "typeorm"
import { User } from "./User";

export enum EnumStatus {
    ABERTO = 'aberto',
    CHEIO = 'cheio',
    FECHADO = 'fechado',
    CANCELADO = 'cancelado',
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

    @Column()
    nomePalestrante: string;

    @Column()
    descricao: string;

    @Column()
    data: Date;

    @Column()
    CreateAt: Date = new Date();

    @ManyToOne(() => User, (user) => user.eventos)
    user: User

    @Column({
        type: 'enum',
        enum: EnumStatus,
        default: EnumStatus.ABERTO,
    })
    status: EnumStatus;


    @BeforeUpdate()
    @AfterLoad()
    verificaData() {
        if(this.data < new Date() && this.status != EnumStatus.CANCELADO) {
            const date1 = new Date(this.data);
            const date2 = new Date();
            const hoursDiff = diffHours(date1, date2);
            if(hoursDiff > this.quantidadeDeHoras){
                this.status = EnumStatus.FECHADO;
            }
        }
        function diffHours(date1: Date, date2: Date): number {
            const timeDiff = Math.abs(date2.getTime() - date1.getTime());
            const diffHours = Math.ceil(timeDiff / (1000 * 3600)); 
            return diffHours;
          }
    }

     
}
