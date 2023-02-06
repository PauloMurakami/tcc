import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { hashSenha, RoleEnumType, User } from '../entity/User';
import { loggerInfo } from '../utils/logger';

class ProfessorController {
    async register(req: Request, res: Response) {
        loggerInfo("exec a register Professor");
        const userRepository = AppDataSource.getRepository(User)
        const { email, senha, nome } = req.body
        const userExists = await userRepository.findOne({ where: { email } })
        const role = RoleEnumType.PROFESSOR;
        if (userExists) {
            return res.sendStatus(409);
        }
        let permiteVerificacao = true
        const user = userRepository.create({ nome, email, senha, permiteVerificacao })
        user.role = role;
        await userRepository.save(user)
        delete user.senha;
        delete user.role;
        loggerInfo("Professor created");
        return res.json({
            user
        })
    }
    async list(req: Request, res: Response) {
        loggerInfo("exec a list Professor");
        const userRepository = AppDataSource.getRepository(User)
        const professors = await userRepository.find({ where: { role: RoleEnumType.PROFESSOR } })
        for (const professor of professors) {
            delete professor.senha;
        }
        return res.json({
            professors
        })
    }
    async professor(req: Request, res: Response) {
        loggerInfo("exec a professor");
        const id = req.params.id
        const userRepository = AppDataSource.getRepository(User)
        const professor = await userRepository.findOne({ where: { id } })

        if(!professor){
            res.sendStatus(404)
        }
        delete professor.senha;
        return res.json({
            professor
        })
    }

    async update(req: Request, res: Response) {
        loggerInfo("exec a update professor")
        const userRepository = AppDataSource.getRepository(User)
        const {nome, email, RA, senha} = req.body;
        const id = req.params.id;
        const professor = await userRepository.findOne({where:{id}})
        const existsProfessorEmail = await userRepository.findOne({where:{email}})
        if(existsProfessorEmail){
            return res.sendStatus(409)
        }
        if(!professor){
            return res.sendStatus(404)
        }
        if(nome){
            professor.nome = nome
        }
        if(email){
            professor.email = email
        }
        if(RA){
            professor.RA = RA
        }
        if(senha){
            professor.senha = hashSenha(senha)
        }
        await userRepository.save(professor)
        delete professor.senha;
        return res.json({
            professor
        })
    }
}

export default new ProfessorController;