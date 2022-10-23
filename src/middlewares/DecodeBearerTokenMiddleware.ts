import { NextFunction, Request, Response } from "express";
import { verificaToken } from "../config/jwtConfig";

export default async function DecodeTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new Error("");
        }
        const token = authorization.replace('Bearer', '').trim();

        const data: any = verificaToken(token)
        res.locals.tokenData = data
        next();
    } catch {
        res.sendStatus(401);
    }
}