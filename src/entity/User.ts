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

    @Column({
        default: 0
    })
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
    hashSenha(){
        this.senha = hashSync(this.senha, 8)
    }

}
export function hashSenha(senha: string){
    return hashSync(senha, 8)
}