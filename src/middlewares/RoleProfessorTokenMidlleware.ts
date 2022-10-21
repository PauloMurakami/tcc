import { NextFunction, Request, Response } from "express";
import { verificaToken } from "../config/jwtConfig";
import { RoleEnumType } from "../entity/User";

export default async function roleProfessorTokenMidlleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new Error("");
        }
        const token = authorization.replace('Barer', '').trim();

        const data: any = verificaToken(token)

        if (data.role != RoleEnumType.PROFESSOR) {
            return res.sendStatus(401);
        }
        next();
    } catch {
        res.sendStatus(401);
    }
}