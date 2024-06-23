import { Request } from 'express';
import { IUser } from '../models/User';

export interface IReqAuth extends Request {
  user?: IUser;
  admin?: IUser;
  role?: string;
}
