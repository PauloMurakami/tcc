import {Request, Response, Router} from 'express'
import AuthController from './controllers/AuthController';
import AlunoController from './controllers/AlunoController';
import tokenMiddleware from './middlewares/TokenMidlleware';

const router = Router();

router.post('/users', AlunoController.register)
router.post('/auth', AuthController.autenticacao)
router.get('/testeMiddleware', tokenMiddleware, (req: Request,res: Response)=>{
    res.sendStatus(200)
})

export default router;
