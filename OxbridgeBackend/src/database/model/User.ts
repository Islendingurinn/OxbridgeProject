import { model, Schema, Document } from 'mongoose';
import Role from './Role';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User extends Document {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    roles: Role[];
}

const UserSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    roles: {
        type: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Role',
          },
        ],
    }
});

export const UserModel = model<User>(DOCUMENT_NAME, UserSchema, COLLECTION_NAME);