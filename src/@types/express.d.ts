import 'express';
import { RoleEnumType } from '../entity/User';


declare module 'express' {
  export interface Response {
    locals: {
      tokenData?: {
        permiteVerificacao: any;
        id: string
        role: RoleEnumType
      };
    };
  }
}