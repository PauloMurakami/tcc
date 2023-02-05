import { NextFunction, Request, Response } from "express";
import { verificaToken } from "../config/jwtConfig";
import { loggerInfo } from "../utils/logger";

export default async function tokenMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        loggerInfo("Start token validation");
        const { authorization } = req.headers;
        if (!authorization) {
            return res.sendStatus(401);
        }
        const token = authorization.replace('Barer', '').trim();

        const data: any = verificaToken(token)
        next();
    } catch {
        return res.sendStatus(401);
    }
}