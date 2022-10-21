import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import { hashSync } from 'bcryptjs';

export enum RoleEnumType {
    ALUNO = 'aluno',
    PROFESSOR = 'professor',
    FACULDADE = 'faculdade',
  }
@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column()
    nome: string

    @Column()
    email: string

    @Column()
    senha: string

    @Column({
        type: 'enum',
        enum: RoleEnumType,
        default: RoleEnumType.ALUNO,
    })
    role: RoleEnumType;

    @BeforeInsert()
    @BeforeUpdate()
    hashSenha(){
        this.senha = hashSync(this.senha, 8)
    }
}
