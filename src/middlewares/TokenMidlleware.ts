import { NextFunction, Request, Response } from "express";
import { verificaToken } from "../config/jwtConfig";

export default async function tokenMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new Error("");
        }
        const token = authorization.replace('Barer', '').trim();

        const data: any = verificaToken(token)
        next();
    } catch {
        res.sendStatus(401);
    }
}