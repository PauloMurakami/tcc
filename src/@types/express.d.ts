import 'express';
import { RoleEnumType } from '../entity/User';

interface Locals {
  tokenData?: {
    permiteVerificacao: any;
    id: string
    role: RoleEnumType
  };
}

declare module 'express' {
  export interface Response  {
    locals: Locals;
  }
}