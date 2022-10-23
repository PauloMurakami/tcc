import { Request, Response, Router } from 'express';
import AlunoController from './controllers/AlunoController';
import AuthController from './controllers/AuthController';
import EventoController from './controllers/EventoController';
import ProfessorController from './controllers/ProfessorController';
import checkRoleFaculdadeMiddleware from './middlewares/CheckRoleFaculdadeMiddleware';
import checkRoleProfessorMidlleware from './middlewares/CheckRoleProfessorMidlleware';
import decodeTokenMiddleware from './middlewares/DecodeBearerTokenMiddleware';
import tokenMiddleware from './middlewares/TokenMidlleware';

const router = Router();

router.post('/register', AlunoController.register)
router.post('/auth', AuthController.autenticacao)
router.post('/register-teacher', decodeTokenMiddleware, checkRoleFaculdadeMiddleware, ProfessorController.register)
router.post('/register-event', decodeTokenMiddleware, checkRoleProfessorMidlleware, EventoController.createEvento)
// router.post('/register-teacher', roleFaculdadeTokenMidlleware, ProfessorController.register)
// router.post('/register-event', roleProfessorTokenMidlleware, EventoController.createEvento)
router.get('/find-events-open', tokenMiddleware, EventoController.findEventsOpen)
router.get('/join-event/:id',tokenMiddleware,  EventoController.joinEvent)
router.get('/find-events', tokenMiddleware, EventoController.findEvents)
router.get('/testeMiddleware', tokenMiddleware, (req: Request, res: Response) => {
    res.sendStatus(200)
})

router.get('/health', (req: Request, res: Response) => {
    res.status(200).send('Thank`s Tio Balan!!')
})

export default router;
