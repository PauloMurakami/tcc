import { Request, Response, Router } from 'express';
import AlunoController from './controllers/AlunoController';
import AuthController from './controllers/AuthController';
import EventoController from './controllers/EventoController';
import ProfessorController from './controllers/ProfessorController';
import { RoleEnumType } from './entity/User';
import checkRoleMiddleware from './middlewares/CheckRoleMiddleware';
import decodeTokenMiddleware from './middlewares/DecodeBearerTokenMiddleware';
import tokenMiddleware from './middlewares/TokenMidlleware';
import Mail from './utils/Mail';

const router = Router();

router.post('/register', AlunoController.register)
router.post('/auth', AuthController.autenticacao)
router.post('/register-teacher', decodeTokenMiddleware, checkRoleMiddleware(RoleEnumType.FACULDADE), ProfessorController.register)
router.post('/register-event', decodeTokenMiddleware, checkRoleMiddleware(RoleEnumType.PROFESSOR), EventoController.createEvento)
router.get('/find-events-open', decodeTokenMiddleware, tokenMiddleware, EventoController.findEventsOpen)
router.get('/join-event/:id', decodeTokenMiddleware, tokenMiddleware, EventoController.joinEvent)
router.get('/find-events', decodeTokenMiddleware, tokenMiddleware, EventoController.findEvents)
router.post('/send-certificate/:id', decodeTokenMiddleware, checkRoleMiddleware(RoleEnumType.PROFESSOR), EventoController.sendCertificate)
router.get('/testeMiddleware', decodeTokenMiddleware, tokenMiddleware, (req: Request, res: Response) => {
    res.sendStatus(200)
})

router.get('/health', (req: Request, res: Response) => {
    res.status(200).send('Thank`s Tio Balan!!')
})

export default router;
