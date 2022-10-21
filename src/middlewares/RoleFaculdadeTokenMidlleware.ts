import { NextFunction, Request, Response } from "express";
import { verificaToken } from "../config/jwtConfig";
import { RoleEnumType } from "../entity/User";

export default async function roleFaculdadeTokenMidlleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
        res.sendStatus(401);
    }
    const token = authorization.replace('Barer', '').trim();

    try {
        const data: any = verificaToken(token)

        if(data.role != RoleEnumType.FACULDADE){
            res.sendStatus(401);
        }
        req.headers.id = data.id;
        req.headers.role = data.role;
        next();
    } catch {
        res.sendStatus(500);
    }
}