import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { EnumStatus, Evento } from "../entity/Eventos";
import { ListaDeCadastrados } from "../entity/ListaDeCadastrados";
import { User } from "../entity/User";
import { getIdJWT } from "../utils/getInfoJWT";

class EventoController {
    async createEvento(req: Request, res: Response) {
        const userRepository = AppDataSource.getRepository(User);
        const eventoRepository = AppDataSource.getRepository(Evento);
        const { nome, quantidadeDeHoras, quantidadeDeVagas, descricao, data } = req.body
        const userId = getIdJWT(req.headers.authorization.toString());
        const userExists = await userRepository.findOne({ where: { id: userId } })
        if (!userExists) {
            res.sendStatus(401);
        }
        const evento = eventoRepository.create({ nome, quantidadeDeHoras, quantidadeDeVagas, descricao, data, user: userExists })

        await eventoRepository.save(evento)

        res.sendStatus(200);

    }
    async findEvents(req: Request, res: Response) {
        const eventoRepository = AppDataSource.getRepository(Evento);
        const eventosExistentes = await eventoRepository.find()
        res.json({
            eventos: eventosExistentes
        })
    }
    async findEventsOpen(req: Request, res: Response) {
        const eventoRepository = AppDataSource.getRepository(Evento);
        const eventosExistentes = await eventoRepository.find({ where: { status: EnumStatus.ABERTO } })
        res.json({
            eventos: eventosExistentes
        })
    }
    async joinEvent(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const eventoRepository = AppDataSource.getRepository(Evento);
            const listaDeCadastradosRepository = AppDataSource.getRepository(ListaDeCadastrados);
            const userId = getIdJWT(req.headers.authorization.toString());

            const eventosExistente = await eventoRepository.findOne({ where: { id: id, status: EnumStatus.ABERTO } })
            if (!eventosExistente) {
                throw new Error("Evento Indisponivel!");
            }

            const quantidadeDeCadastrados = await listaDeCadastradosRepository.findAndCount({
                where: { evento: eventosExistente.id }
            })
            if (eventosExistente.quantidadeDeVagas <= quantidadeDeCadastrados[1]) {
                eventosExistente.status = EnumStatus.CHEIO;
                await eventoRepository.update(
                    eventosExistente.id,
                    eventosExistente)
                throw new Error("Evento Lotado");
            }
            const usuarioJaCadastrado = await listaDeCadastradosRepository.find({ where: { evento: eventosExistente.id, usuario: userId } })
            if (usuarioJaCadastrado.length > 0) {
                throw new Error("Usuario ja cadastrado nesse evento!");
            }
            const cadastrarUsuario = listaDeCadastradosRepository.create({ usuario: userId, evento: eventosExistente.id })
            await listaDeCadastradosRepository.save(cadastrarUsuario)
            res.send({ message: "Cadastrado no Evento com sucesso" }).status(200)
        } catch (error) {
            res.status(422).send({ message: error.message })
        }

    }
}

export default new EventoController