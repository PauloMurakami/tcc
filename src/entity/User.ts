import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany, ManyToMany, JoinTable, PrimaryColumn } from "typeorm"
import { hashSync } from 'bcryptjs';
import { Evento } from "./Eventos";

export enum RoleEnumType {
    ALUNO = 'aluno',
    PROFESSOR = 'professor',
    FACULDADE = 'faculdade',
  }
@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    RA: number
    
    @Column()
    nome: string

    @Column()
    email: string

    @Column()
    senha: string

    @Column({
        default: false
    })
    permiteVerificacao: boolean

    @Column({
        type: 'enum',
        enum: RoleEnumType,
        default: RoleEnumType.ALUNO,
    })
    role: RoleEnumType;
    
    @OneToMany(() => Evento, (evento) => evento.user)
    eventos: Evento[]

    @BeforeInsert()
    @BeforeUpdate()
    hashSenha(){
        this.senha = hashSync(this.senha, 8)
    }

}
