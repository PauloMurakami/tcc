import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { ListaDeCadastrados } from '../entity/ListaDeCadastrados';
import { User } from '../entity/User';
import { loggerError, loggerInfo } from '../utils/logger';

class AlunoController {
    async register(req: Request, res: Response) {
        loggerInfo("exec register usuario")

        const userRepository = AppDataSource.getRepository(User)
        const { email, senha, nome, RA } = req.body
        const userExists = await userRepository.findOne({ where: { email } })

        if (userExists) {
            loggerError("Usuario ja existente")
            return res.sendStatus(409);
        }
        const user = userRepository.create({ nome, email, senha, RA})
      
        await userRepository.save(user)
        delete user.senha;
        delete user.role;
        loggerInfo("usuario registrado")
        return res.json({
            user
        })
    }
    async verifyEvent(req: Request, res: Response){

        const id = req.params.id;

        const userRepository = AppDataSource.getRepository(User);

        const userExists = await userRepository.findOne({where:{id: id}})

        if(!userExists){
            loggerError("Usuario não existe!")
            return res.sendStatus(400);
        }
        userExists.permiteVerificacao = true;
        delete userExists.senha;
        await userRepository.save(userExists);
        return res.sendStatus(204)
    }

    async notVerifyEvent(req: Request, res: Response){

        const id = req.params.id;

        const userRepository = AppDataSource.getRepository(User);

        const userExists = await userRepository.findOne({where:{id: id}})

        if(!userExists){
            loggerError("Usuario não existe!")
            return res.sendStatus(400);
        }
        userExists.permiteVerificacao = false;
        delete userExists.senha;

        await userRepository.save(userExists);
        return res.sendStatus(204)
    }


    async findUserByEvents(req: Request, res: Response){

        //TERMINAR
        loggerInfo("exec findUserByEventso")
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