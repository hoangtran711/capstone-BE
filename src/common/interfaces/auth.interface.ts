import { User } from 'entities/user.interface';
import { Request } from 'express';

export interface DataStoredInToken extends Partial<User> {
  uid: string;
  email?: string;
  username?: string;
  role?: RoleEnum;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export type CookieData = string;

export interface RequestContext {
  user: User;
}
export interface RequestWithContext extends Request {
  context: RequestContext;
}

export enum RoleEnum {
  Admin = 'Admin',
  Manager = 'Teacher',
  EndUser = 'Student',
}
