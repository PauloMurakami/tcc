import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { ListaDeCadastrados } from '../entity/ListaDeCadastrados';
import { User } from '../entity/User';

class AlunoController {
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
    async findUserByEvents(req: Request, res: Response){
        const id = req.params.id;
        const userRepository = AppDataSource.getRepository(User)
        let usuarios: any[] = [];
        const listaDeCadastradosRepository = AppDataSource.getRepository(ListaDeCadastrados)
        const userExists = await listaDeCadastradosRepository.find({ where: { evento: id } })
        if(!userExists){

        }
        for (const user of userExists) {
            const findUser = await userRepository.findOne({ where: { id : user.usuario } })
            delete findUser.senha;
            delete findUser.role;
            usuarios.push(findUser)
        }
        return res.json({
            usuarios
        })
    }
}

export default new AlunoController;