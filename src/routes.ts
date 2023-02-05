import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response, Router } from 'express';
import AlunoController from './controllers/AlunoController';
import AuthController from './controllers/AuthController';
import EventoController from './controllers/EventoController';
import ProfessorController from './controllers/ProfessorController';
import { RoleEnumType } from './entity/User';
import checkRoleMiddleware from './middlewares/CheckRoleMiddleware';
import decodeTokenMiddleware from './middlewares/DecodeBearerTokenMiddleware';
import tokenMiddleware from './middlewares/TokenMidlleware';

const router = Router();

router.post('/register', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        senha: Joi.string().required(),
    }),
}), AlunoController.register)
router.post('/auth', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        senha: Joi.string().required(),
    }),
}), AuthController.autenticacao)
router.post('/register-teacher',celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        nome: Joi.string().required(),
        senha: Joi.string().required(),
    })
}), decodeTokenMiddleware, checkRoleMiddleware(RoleEnumType.FACULDADE), ProfessorController.register)
router.post('/register-event',celebrate({
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        quantidadeDeHoras: Joi.number().required(),
        quantidadeDeVagas: Joi.number().required(),
        descricao: Joi.string().required(),
        data: Joi.date().required()
    })
}), decodeTokenMiddleware, checkRoleMiddleware(RoleEnumType.PROFESSOR), EventoController.createEvento)
router.get('/find-events-open', decodeTokenMiddleware, tokenMiddleware, EventoController.findEventsOpen)
router.get('/join-event/:id', decodeTokenMiddleware, tokenMiddleware, EventoController.joinEvent)
router.get('/find-events', decodeTokenMiddleware, tokenMiddleware, EventoController.findEvents)
router.post('/send-certificate/:id',celebrate({
    [Segments.BODY]: Joi.object().keys({
        idEvent: Joi.string().required(),
    })
}), decodeTokenMiddleware, checkRoleMiddleware(RoleEnumType.PROFESSOR), EventoController.sendCertificate)
router.get('/find-users-for-event/:id', decodeTokenMiddleware, checkRoleMiddleware(RoleEnumType.PROFESSOR), AlunoController.findUserByEvents)
router.get('/testeMiddleware', decodeTokenMiddleware, tokenMiddleware, (req: Request, res: Response) => {
    res.sendStatus(200)
})

router.get('/health', (req: Request, res: Response) => {
    res.status(200).send('Thank`s Tio Balan!!')
})

export default router;
