import { verify, sign } from 'jsonwebtoken'
require('dotenv').config();
const tokenVerifyCode = process.env.TOKENVERIFYCODE;

export function verificaToken(token: string) {
    return verify(token, tokenVerifyCode)
}

export function cadastraToken(object: any) {
    return sign({ id: object.id, role: object.role}, tokenVerifyCode, { expiresIn: '1d' })
}