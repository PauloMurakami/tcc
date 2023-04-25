import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response, Router } from 'express';
import AlunoController from './controllers/AlunoController';
import AuthController from './controllers/AuthController';
import EventoController from './controllers/EventoController';
import ProfessorController from './controllers/ProfessorController';
import { RoleEnumType } from './entity/User';
import checkPermissionMiddleware from "./middlewares/CheckPermissionMiddlaware";
import checkRoleMiddleware from './middlewares/CheckRoleMiddleware';
import decodeTokenMiddleware from './middlewares/DecodeBearerTokenMiddleware';
import tokenMiddleware from './middlewares/TokenMidlleware';

const router = Router();

router.post('/register', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        senha: Joi.string().required(),
        nome: Joi.string().required(),
        RA: Joi.number().required()
    }),
}), AlunoController.register)
router.post('/auth', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        senha: Joi.string().required(),
    }),
}), AuthController.autenticacao)
router.post('/register-teacher', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        nome: Joi.string().required(),
        senha: Joi.string().required(),
    })
}), decodeTokenMiddleware, tokenMiddleware, checkRoleMiddleware(RoleEnumType.FACULDADE), ProfessorController.register)

router.get('/list-teacher', decodeTokenMiddleware, tokenMiddleware, checkRoleMiddleware(RoleEnumType.FACULDADE), ProfessorController.list)
router.get('/list-teacher/:id', decodeTokenMiddleware, tokenMiddleware, checkRoleMiddleware(RoleEnumType.FACULDADE), ProfessorController.professor)
router.put('/update-teacher/:id', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email(),
        senha: Joi.string(),
        nome: Joi.string(),
        RA: Joi.number()
    })
}), decodeTokenMiddleware, tokenMiddleware, checkRoleMiddleware(RoleEnumType.FACULDADE), ProfessorController.update)

router.post('/register-event', celebrate({
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        quantidadeDeHoras: Joi.number().required(),
        quantidadeDeVagas: Joi.number().required(),
        nomePalestrante: Joi.string().required(),
        descricao: Joi.string().required(),
        data: Joi.string().required()
    })
}), decodeTokenMiddleware, checkRoleMiddleware(RoleEnumType.PROFESSOR), EventoController.createEvento)

router.delete('/delete-event/:id', decodeTokenMiddleware, checkRoleMiddleware(RoleEnumType.PROFESSOR), EventoController.deleteEvento)
router.get('/find-events-open', decodeTokenMiddleware, tokenMiddleware, EventoController.findEventsOpen)
router.get('/find-events-joined/', decodeTokenMiddleware, tokenMiddleware, EventoController.findEventsJoined)
router.get('/join-event/:id', decodeTokenMiddleware, tokenMiddleware, EventoController.joinEvent)
router.get('/find-events', decodeTokenMiddleware, tokenMiddleware, EventoController.findEvents)
router.post('/send-certificate/:id', celebrate({
    [Segments.BODY]: Joi.object().keys({
        idEvent: Joi.string().required(),
    })
}), decodeTokenMiddleware, checkPermissionMiddleware, EventoController.sendCertificate);
router.put('/send-certificate/:id', decodeTokenMiddleware, tokenMiddleware, EventoController.sendCertificateValidated);
router.get('/find-users-for-event/:id', decodeTokenMiddleware, tokenMiddleware, checkRoleMiddleware(RoleEnumType.PROFESSOR), AlunoController.findUserByEvents) //TERMINAR

router.put('/give-permission/:id', decodeTokenMiddleware, tokenMiddleware, checkRoleMiddleware(RoleEnumType.PROFESSOR), AlunoController.verifyEvent)
router.put('/take-permission/:id', decodeTokenMiddleware, tokenMiddleware, checkRoleMiddleware(RoleEnumType.PROFESSOR), AlunoController.notVerifyEvent)

router.get('/testeMiddleware', decodeTokenMiddleware, tokenMiddleware, (req: Request, res: Response) => {
    res.sendStatus(200)
})

router.get('/health', (req: Request, res: Response) => {
    res.status(200).send('Thank`s Tio Balan!!')
})

export default router;
