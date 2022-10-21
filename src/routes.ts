import { Request, Response, Router } from 'express'
import AuthController from './controllers/AuthController';
import AlunoController from './controllers/AlunoController';
import tokenMiddleware from './middlewares/TokenMidlleware';
import ProfessorController from './controllers/ProfessorController';
import roleFaculdadeTokenMidlleware from './middlewares/RoleFaculdadeTokenMidlleware';

const router = Router();

router.post('/register', AlunoController.register)
router.post('/auth', AuthController.autenticacao)
router.post('/register-teacher', roleFaculdadeTokenMidlleware, ProfessorController.register)
router.get('/testeMiddleware', tokenMiddleware, (req: Request, res: Response) => {
    res.sendStatus(200)
})

router.get('/health', (req: Request, res: Response) => {
    res.sendStatus(200)
})

export default router;
