import { Request, Response } from 'express';
export enum UserRoleEnum {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
}

export type RequestT<T> = Request<unknown, unknown, T>;

export interface IRequest<T> extends RequestT<T> {}
