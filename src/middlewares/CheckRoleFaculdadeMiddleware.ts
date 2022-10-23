import { NextFunction, Request, Response } from "express";
import { verificaToken } from "../config/jwtConfig";
import { RoleEnumType } from "../entity/User";

export default async function CheckRoleFaculdadeMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { tokenData } = res.locals;
        if (!tokenData) {
            throw new Error("");
        }
        if (tokenData?.role != RoleEnumType.FACULDADE) {
            res.sendStatus(401);
        }
        next();
    } catch {
        res.sendStatus(401);
    }
}