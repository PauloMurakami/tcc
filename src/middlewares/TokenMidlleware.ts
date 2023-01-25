import { NextFunction, Request, Response } from "express";
import { verificaToken } from "../config/jwtConfig";
import { loggerInfo } from "../utils/logger";

export default async function tokenMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        loggerInfo("Start token validation");
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