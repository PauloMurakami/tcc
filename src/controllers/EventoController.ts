import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { EnumStatus, Evento } from "../entity/Eventos";
import { ListaDeCadastrados } from "../entity/ListaDeCadastrados";
import { User } from "../entity/User";
import * as nodemailer from "nodemailer";
import config from '../config/mailConfig';
import { criarPDF, deletarPDF } from "../utils/pdf";
import { loggerError, loggerInfo, loggerWarn, loggerWarnItem } from "../utils/logger";

class EventoController {
    async createEvento(req: Request, res: Response) {
        loggerInfo("exec createEvento");
        const userRepository = AppDataSource.getRepository(User);
        const eventoRepository = AppDataSource.getRepository(Evento);
        const { nome, quantidadeDeHoras, quantidadeDeVagas, descricao, data } = req.body
        const userId = res.locals.tokenData.id;
        const userExists = await userRepository.findOne({ where: { id: userId } })
        if (!userExists) {
            res.sendStatus(401);
        }
        const evento = eventoRepository.create({ nome, quantidadeDeHoras, quantidadeDeVagas, descricao, data, user: userExists })

        await eventoRepository.save(evento)

        res.sendStatus(200);

    }
    async findEvents(req: Request, res: Response) {
        loggerInfo("exec findEvents");
        const eventoRepository = AppDataSource.getRepository(Evento);
        const eventosExistentes = await eventoRepository.find()
        res.json({
            eventos: eventosExistentes
        })
    }
    async findEventsOpen(req: Request, res: Response) {
        loggerInfo("exec findEventsOpen");
        const eventoRepository = AppDataSource.getRepository(Evento);
        const eventosExistentes = await eventoRepository.find({ where: { status: EnumStatus.ABERTO } })
        res.json({
            eventos: eventosExistentes
        })
    }
    async joinEvent(req: Request, res: Response) {
        try {
            loggerInfo("exec joinEvent");
            const id = req.params.id;
            const eventoRepository = AppDataSource.getRepository(Evento);
            const listaDeCadastradosRepository = AppDataSource.getRepository(ListaDeCadastrados);
            const userId = res.locals.tokenData.id;

            const eventosExistente = await eventoRepository.findOne({ where: { id: id, status: EnumStatus.ABERTO } })
            if (!eventosExistente) {
                loggerError("Evento Lotado!");
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
                loggerWarn("Evento Lotado!");
                throw new Error("Evento Lotado");
            }
            const usuarioJaCadastrado = await listaDeCadastradosRepository.find({ where: { evento: eventosExistente.id, usuario: userId } })
            if (usuarioJaCadastrado.length > 0) {
                loggerWarn("Usuario ja cadastrado nesse evento!");
                throw new Error("Usuario ja cadastrado nesse evento!");
            }
            const cadastrarUsuario = listaDeCadastradosRepository.create({ usuario: userId, evento: eventosExistente.id })
            await listaDeCadastradosRepository.save(cadastrarUsuario)
            res.send({ message: "Cadastrado no Evento com sucesso" }).status(200)
        } catch (error) {
            res.status(422).send({ message: error.message })
        }
    }
    async outEvent(req: Request, res: Response) {
        try {
            // TERMINAR 
            const id = req.params.id;
            const eventoRepository = AppDataSource.getRepository(Evento);
            const eventosExistente = await eventoRepository.findOne({ where: { id: id, status: EnumStatus.ABERTO } })
            res.send({ message: "Cadastrado no Evento com sucesso" }).status(200)
        } catch (error) {
            res.status(422).send({ message: error.message })

        }
    }
    async sendCertificate(req: Request, res: Response) {
        try {
            loggerInfo("exec sendCertificate");
            const id = req.params.id;
            const idEvent = req.body.idEvent
            const eventoRepository = AppDataSource.getRepository(Evento);
            const userRepository = AppDataSource.getRepository(User);

            const eventoExistente = await eventoRepository.findOne({ where: { id: idEvent } })
            if (!eventoExistente) {
                loggerError("Evento não encontrado!");
                throw new Error("Evento não encontrado");
            }

            const usuarioExistente = await userRepository.findOne({ where: { id: id } })
            if (!usuarioExistente) {
                loggerError("Usuario não encontrado!");
                throw new Error("Usuario não encontrado");
            }
            await criarPDF({
                html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <h1>Ola Mundo</h1>
                </body>
                </html>
            `,
                id: usuarioExistente.id
            })
            let mailOptions = {
                from: 'paulolindus@hotmail.com',
                to: usuarioExistente.email,
                subject: "teste",
                html: '',
                attachments: [{
                    filename: `${id}.pdf`,
                    path: `./src/public/assets/${id}.pdf`,
                    contentType: 'application/pdf'
                }]
            };
    
            const transporter = nodemailer.createTransport({
                service: 'Hotmail',
                auth: {
                    user: config.user,
                    pass: config.password
                },
            });
            loggerInfo("Enviando email")
            return transporter.sendMail(mailOptions, async function (error, info) {
                if (error) {
                    res.send({message: 'Erro ao enviar o email'}).status(500)
                } else {
                    await deletarPDF(id)
                    loggerInfo("Email enviado")
                    res.send({ message: "Email enviado com sucesso" }).status(200)
                }
            })

        } catch (error) {
            res.status(422).send({ message: error.message })

        }
    }
}

export default new EventoController