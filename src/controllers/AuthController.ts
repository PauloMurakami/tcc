import { compare } from 'bcryptjs';
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { cadastraToken } from '../config/jwtConfig';
import { loggerError, loggerInfo } from '../utils/logger';
class AuthController {
    async autenticacao(req: Request, res: Response) {
        loggerInfo("Autenticando usuario")
        const userRepository = AppDataSource.getRepository(User)
        const { email, senha, nome } = req.body
        const userExists = await userRepository.findOne({ where: { email } })

        if (!userExists) {
            loggerError("Usuario não existe")
            return res.sendStatus(401);
        }

        const senhaValida = await compare(senha, userExists.senha)

        if (!senhaValida) {
            loggerError("Credenciais invalidas")
            return res.sendStatus(401);
        }
        const token = cadastraToken({ id: userExists.id, role: userExists.role, permiteVerificacao: userExists.permiteVerificacao})
        delete userExists.senha;
        loggerInfo("Usuario autenticado")
        return res.json({
            userExists,
            token
        })
    }
}

export default new AuthController;