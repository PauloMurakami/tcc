import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { RoleEnumType, User } from '../entity/User';
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
}

export default new ProfessorController;