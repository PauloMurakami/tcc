import { NextFunction, Request, Response } from "express";
import { verificaToken } from "../config/jwtConfig";
import { RoleEnumType } from "../entity/User";
import { loggerInfo, loggerInfoItem } from "../utils/logger";

export default async function checkPermissionMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        loggerInfo("Start a check role is valid");
        const { tokenData } = res.locals;
        if (!tokenData.permiteVerificacao) {
            return res.sendStatus(401);
        }
        loggerInfoItem("Token role:", tokenData?.permiteVerificacao)
        next();
    } catch {
        return res.sendStatus(401);
    }
} 