import { NextFunction, Request, Response } from "express";
import { verificaToken } from "../config/jwtConfig";
import { loggerInfo } from "../utils/logger";

export default async function DecodeTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        loggerInfo("Start decode TokenMiddleware");
        const { authorization } = req.headers;
        if (!authorization) {
            throw new Error("");
        }
        const token = authorization.replace('Bearer', '').trim();

        const data: any = verificaToken(token)
        if(!verificaToken){
            return res.sendStatus(401);
        }
        res.locals.tokenData = data
        next();
    } catch {
        res.sendStatus(401);
    }
}