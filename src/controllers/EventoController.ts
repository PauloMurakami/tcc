import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { EnumStatus, Evento } from "../entity/Eventos";
import { ListaDeCadastrados } from "../entity/ListaDeCadastrados";
import { User } from "../entity/User";
import * as nodemailer from "nodemailer";
import config from '../config/mailConfig';
import { criarPDF, deletarPDF } from "../utils/pdf";
import { loggerError, loggerInfo, loggerWarn, loggerWarnItem } from "../utils/logger";
import { Repository } from "typeorm";

class EventoController {
    async createEvento(req: Request, res: Response) {
        try {
            loggerInfo("exec createEvento");
            const userRepository = AppDataSource.getRepository(User);
            const eventoRepository = AppDataSource.getRepository(Evento);
            const { nome, quantidadeDeHoras, quantidadeDeVagas, descricao, data, nomePalestrante } = req.body
            const userId = res.locals.tokenData.id;
            const userExists = await userRepository.findOne({ where: { id: userId } })
            if (!userExists) {
                res.sendStatus(401);
            }
            let dataFormatada = JSON.parse(data)
            const evento = eventoRepository.create({ nome, quantidadeDeHoras, quantidadeDeVagas, nomePalestrante, descricao, data: dataFormatada, user: userExists })

            await eventoRepository.save(evento)

            res.sendStatus(200);

        } catch (error) {
            res.status(422).send({ message: error.message })

        }

    }
    async deleteEvento(req: Request, res: Response) {
        try {
            loggerInfo("exec deleteEvento");
            const eventoRepository = AppDataSource.getRepository(Evento);
            const id = req.params.id;
            const eventosExistente = await eventoRepository.findOne({ where: { id: id } })

            if (!eventosExistente) {
                throw new Error("Evento não encontrado!");
            }
            eventoRepository.delete(id)
            res.sendStatus(202);
        } catch (error) {
            res.status(422).send({ message: error.message })
        }
    }
    async findEvents(req: Request, res: Response) {
        try {
            loggerInfo("exec findEvents");
            const eventoRepository = AppDataSource.getRepository(Evento);
            let eventosExistentesParaFechar = await eventoRepository.find();
            for (const evento of eventosExistentesParaFechar) {
                if (evento.status == EnumStatus.FECHADO) {
                    await eventoRepository.update(
                        evento.id,
                        evento
                    );
                }
            }
            const eventosExistentes = await eventoRepository.find()
            res.json({
                eventos: eventosExistentes
            })

        } catch (error) {
            res.status(422).send({ message: error.message })

        }
    }
    async findEventsOpen(req: Request, res: Response) {
        try {
            loggerInfo("exec findEventsOpen");
            const eventoRepository = AppDataSource.getRepository(Evento);
            let eventosExistentesParaFechar = await eventoRepository.find();
            for (const evento of eventosExistentesParaFechar) {
                if (evento.status == EnumStatus.FECHADO) {
                    await eventoRepository.update(
                        evento.id,
                        evento
                    );
                }
            }
            const eventosExistentes = await eventoRepository.findBy({ status: EnumStatus.ABERTO })
            res.json({
                eventos: eventosExistentes
            })

        } catch (error) {
            res.status(422).send({ message: error.message })

        }
    }
    async findEventsJoinUserAndCheck(req: Request, res: Response){
        try {
            const id = req.params.id;
            let retornoEventos = []
            const userId = res.locals.tokenData.id;
            const eventoRepository = AppDataSource.getRepository(Evento);
            const listaDeCadastradosRepository = AppDataSource.getRepository(ListaDeCadastrados);
            const eventosCadastrados = await listaDeCadastradosRepository.find({ where: { usuario: userId, emailEnviado: true } })
            for (const eventoCadastrado of eventosCadastrados) {
                let evento = await eventoRepository.findOne({ where: { id: eventoCadastrado.evento } });
                if(evento){
                    retornoEventos.push({
                        emailEnviado: eventoCadastrado.emailEnviado,
                        ...evento
                    })
                }
            }
            res.send({ eventos: retornoEventos }).status(200)
        } catch (error) {
            res.status(422).send({ message: error.message })
        }
    }
    async findEventsJoined(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const userId = res.locals.tokenData.id;
            let retornoEventos = []
            const eventoRepository = AppDataSource.getRepository(Evento);
            let eventFinded = await eventoRepository.find({ where: { status: EnumStatus.ABERTO } })
            for (const evento of eventFinded) {
                retornoEventos.push(evento)
            }
            let eventFindedFull = await eventoRepository.find({ where: { status: EnumStatus.CHEIO } })
            for (const evento of eventFindedFull) {
                retornoEventos.push(evento)
            }
            res.send({ eventos: retornoEventos }).status(200)
        } catch (error) {
            res.status(422).send({ message: error.message })
        }
    }
    async findEventsUserNotJoin(req: Request, res: Response) {
        try {
            let retornoEventos = []
            loggerInfo("exec findEventsUserJoin");
            const id = req.params.id;
            const eventoRepository = AppDataSource.getRepository(Evento);
            const listaDeCadastradosRepository = AppDataSource.getRepository(ListaDeCadastrados);
            const userId = res.locals.tokenData.id;
            const eventoList = await eventoRepository.find({ where: { status: EnumStatus.ABERTO} });
            for (const evento of eventoList) {
                const eventosCadastrados = await listaDeCadastradosRepository.findOne({ where: { usuario: userId, evento: evento.id} })
                if(!eventosCadastrados){
                    retornoEventos.push({
                        ...evento
                    })
                }

            }
            res.send({ eventos: retornoEventos }).status(200)
        } catch (error) {

            res.status(422).send({ message: error.message })
        }
    }
    async findEventsUserJoin(req: Request, res: Response) {
        try {
            let retornoEventos = []
            loggerInfo("exec findEventsUserJoin");
            const id = req.params.id;
            const eventoRepository = AppDataSource.getRepository(Evento);
            const listaDeCadastradosRepository = AppDataSource.getRepository(ListaDeCadastrados);
            const userId = res.locals.tokenData.id;
            const eventosCadastrados = await listaDeCadastradosRepository.find({ where: { usuario: userId, emailEnviado: false } })
            for (const eventoCadastrado of eventosCadastrados) {
                let evento = await eventoRepository.findOne({ where: { id: eventoCadastrado.evento } });
                if(evento){
                    retornoEventos.push({
                        emailEnviado: eventoCadastrado.emailEnviado,
                        ...evento
                    })
                }

            }
            res.send({ eventos: retornoEventos }).status(200)
        } catch (error) {

            res.status(422).send({ message: error.message })
        }
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
    async sendCertificateValidated(req: Request, res: Response) {
        try {

            loggerInfo("exec sendCertificateValidated");
            const id = req.params.id;
            const userId = res.locals.tokenData.id;
            const userRepository = AppDataSource.getRepository(User);
            const userEventoRepository = AppDataSource.getRepository(ListaDeCadastrados);

            const usuarioExistente = await userRepository.findOne({ where: { id: userId } })
            if (!usuarioExistente) {
                loggerError("Usuario não encontrado!");
                throw new Error("Usuario não encontrado");
            }
            const usuarioCadastradoNoEvento = await userEventoRepository.findOne({
                where: {
                    evento: id,
                    usuario: userId
                }
            });
            if (!usuarioCadastradoNoEvento) {
                loggerError("Usuario não cadastrado no evento!");
                throw new Error("Usuario não cadastrado no evento");
            }
            await SendMail(usuarioExistente, userId);
            return res.send({ message: "Email enviado com sucesso" }).status(200);
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
            const userEventoRepository = AppDataSource.getRepository(ListaDeCadastrados);

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

            const usuarioCadastradoNoEvento = await userEventoRepository.findOne({
                where: {
                    evento: idEvent,
                    usuario: id
                }
            });
            if (!usuarioCadastradoNoEvento) {
                loggerError("Usuario não cadastrado no evento!");
                throw new Error("Usuario não cadastrado no evento");
            }
            usuarioCadastradoNoEvento.emailEnviado = true

            await userEventoRepository.save(usuarioCadastradoNoEvento);
            await SendMail(usuarioExistente, id);
            return res.send({ message: "Email enviado com sucesso" }).status(200);


        } catch (error) {
            res.status(422).send({ message: error.message })

        }
    }

}
async function SendMail(usuarioExistente: User, id: string) {
    try {

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
                    <h1>Aqui vai o certificado </h1>
                </body>
                </html>
            `,
            id: usuarioExistente.id
        });
        let mailOptions = {
            from: config.user,
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
            service: 'gmail',
            auth: {
                user: config.user,
                pass: config.password
            },
        });
        loggerInfo("Enviando email");
        return transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                loggerError("erro ao enviar o email para o id: " + id)
                await deletarPDF(id);
            } else {
                await deletarPDF(id);
                loggerInfo("Email enviado para o id: " + id);
            }
        });
    } catch (error) {
        return new Error("Email ja enviado");
    }
}

export default new EventoController