import 'express';
import { RoleEnumType } from '../entity/User';

interface Locals {
  tokenData?: {
    id: string
    role: RoleEnumType
  };
}

declare module 'express' {
  export interface Response  {
    locals: Locals;
  }
}