import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class ListaDeCadastrados {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    usuario: string;

    @Column()
    evento: string;

    @Column('boolean', {default: false})
    emailEnviado: boolean = false;
}
