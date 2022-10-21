import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { EnumStatus, Evento } from "../entity/Eventos";
import { User } from "../entity/User";
import { getIdJWT } from "../utils/getInfoJWT";

class EventoController {
    async createEvento(req: Request, res: Response) {
        const userRepository = AppDataSource.getRepository(User);
        const eventoRepository = AppDataSource.getRepository(Evento);
        const { nome, quantidadeDeHoras, quantidadeDeVagas } = req.body
        const userId =  getIdJWT(req.headers.authorization.toString());
        const userExists = await userRepository.findOne({ where: { id: userId } })
        if(!userExists){
            res.sendStatus(401);
        }
        const evento = eventoRepository.create({ nome, quantidadeDeHoras, quantidadeDeVagas, user: userExists })
      
        await eventoRepository.save(evento)
        
        res.sendStatus(200);

    }
    async findEventsOpen(req: Request, res :Response){
        const eventoRepository = AppDataSource.getRepository(Evento);
        const eventosExistentes = await eventoRepository.find({ where: { status: EnumStatus.ABERTO } })
        res.json({
           eventos: eventosExistentes
        })
    }
}

export default new EventoController