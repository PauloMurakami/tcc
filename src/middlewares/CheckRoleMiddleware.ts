import { NextFunction, Request, Response } from "express";
import { verificaToken } from "../config/jwtConfig";
import { RoleEnumType } from "../entity/User";

export default function checkRoleMiddleware(role: RoleEnumType){
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const { tokenData } = res.locals;
            if (!tokenData) {
                throw new Error("");
            }
            if (tokenData?.role != role) {
                res.sendStatus(401);
            }
            next();
        } catch {
            res.sendStatus(401);
        }
    }
} 