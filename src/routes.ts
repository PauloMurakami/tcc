import {Request, Response, Router} from 'express'
import AuthController from './controllers/AuthController';
import UserController from './controllers/UserController';
import tokenMiddleware from './middlewares/TokenMidlleware';

const router = Router();

router.post('/users', UserController.register)
router.post('/auth', AuthController.autenticacao)
router.get('/testeMiddleware', tokenMiddleware, (req: Request,res: Response)=>{
    console.log(req.headers)
    res.sendStatus(200)
})

export default router;
