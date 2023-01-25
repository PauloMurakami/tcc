import { NextFunction, Request, Response } from "express";
import { verificaToken } from "../config/jwtConfig";
import { RoleEnumType } from "../entity/User";
import { loggerInfo, loggerInfoItem } from "../utils/logger";

export default function checkRoleMiddleware(role: RoleEnumType){
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            loggerInfo("Start a check role is valid");
            const { tokenData } = res.locals;
            if (!tokenData) {
                throw new Error("");
            }
            loggerInfoItem("Token role:", tokenData?.role)
            if (tokenData?.role != role) {
                res.sendStatus(401);
            }
            next();
        } catch {
            res.sendStatus(401);
        }
    }
} 