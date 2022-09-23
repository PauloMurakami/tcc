import { NextFunction, Request, Response } from "express";
import { verificaToken } from "../config/jwtConfig";

export default async function tokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
        res.sendStatus(401);
    }
    const token = authorization.replace('Barer', '').trim();

    try {
        const data: any = verificaToken(token)
        req.headers.id = data.id;
        next();
    } catch {
        res.sendStatus(500);
    }
}