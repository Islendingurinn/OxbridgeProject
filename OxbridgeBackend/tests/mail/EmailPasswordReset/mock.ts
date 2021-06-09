import { Types } from 'mongoose';
import User from '../../../src/database/model/User';

export const USER_ID = new Types.ObjectId();
export const USER = { _id: USER_ID, email: 'dummy@abc.xyz' } as User; 