import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import { hashSync } from 'bcryptjs'
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

    @BeforeInsert()
    @BeforeUpdate()
    hashSenha(){
        this.senha = hashSync(this.senha, 8)
    }
}
