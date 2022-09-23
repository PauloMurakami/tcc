import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { sign } from 'jsonwebtoken';

class UserController {
    async register(req: Request, res: Response) {
        const userRepository = AppDataSource.getRepository(User)
        const { email, senha, nome } = req.body
        const userExists = await userRepository.findOne({ where: { email } })

        if (userExists) {
            return res.sendStatus(409);
        }
        const user = userRepository.create({ nome, email, senha })
      
        await userRepository.save(user)
        delete user.senha;
        delete user.role;

        return res.json({
            user
        })
    }
}

export default new UserController;