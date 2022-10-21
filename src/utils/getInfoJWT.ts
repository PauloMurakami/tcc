import { verificaToken } from "../config/jwtConfig";

export function getIdJWT(token:string) {
    const data: any = verificaToken(token)
    return data.id;
}

export function getRoleJWT(token:string) {
    const data: any = verificaToken(token)
    return data.role;
}