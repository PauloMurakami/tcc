import { compare } from 'bcryptjs';
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { cadastraToken } from '../config/jwtConfig';
class AuthController {
    async autenticacao(req: Request, res: Response) {
        const userRepository = AppDataSource.getRepository(User)
        const { email, senha, nome } = req.body
        const userExists = await userRepository.findOne({ where: { email } })

        if (!userExists) {
            return res.sendStatus(401);
        }

        const senhaValida = await compare(senha, userExists.senha)

        if (!senhaValida) {
            return res.sendStatus(401);
        }
        const token = cadastraToken({ id: userExists.id, role: userExists.role})
        delete userExists.senha;

        return res.json({
            userExists,
            token
        })
    }
}

export default new AuthController;