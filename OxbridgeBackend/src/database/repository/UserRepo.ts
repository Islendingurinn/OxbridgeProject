import User, { UserModel } from '../model/User';
import Role, { RoleModel } from '../model/Role';
import { InternalError } from '../../core/ApiError';
import { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';

export default class UserRepo {
    
    public static async findAll(): Promise<Event[]> {
        return UserModel.find({})
        .select("-password")
        .lean<Event>()
        .exec();
    }

    // contains critical information of the user
    public static async findById(id: Types.ObjectId): Promise<User | null> {
      return UserModel.findOne({ _id: id })
        .populate({
          path: 'roles',
        })
        .lean<User>()
        .exec();
    }

    public static async findByIdSecured(id: Types.ObjectId): Promise<User | null> {
      return UserModel.findOne({ _id: id })
        .select("-password")
        .populate({
          path: 'roles',
        })
        .lean<User>()
        .exec();
    }

    public static async findByEmail(email: string): Promise<User | null> {
        return UserModel.findOne({ email: email })
          .select("-password")
          .populate({
            path: 'roles',
          })
          .lean<User>()
          .exec();
      }

    public static async create(
        user: User,
        accessTokenKey: string,
        refreshTokenKey: string,
        roleCode: string,
    ): Promise<{ user: User; keystore: Keystore }> {
        const now = new Date();
    
        const role = await RoleModel.findOne({ code: roleCode })
          .lean<Role>()
          .exec();
        if (!role) throw new InternalError('Role must be defined');
    
        user.roles = [role._id];
        const createdUser = await UserModel.create(user);
        const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey);
        return { user: createdUser.toObject(), keystore: keystore };
      }

      public static async update(
        user: User,
        accessTokenKey: string,
        refreshTokenKey: string,
      ): Promise<{ user: User; keystore: Keystore }> {
        await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
          .lean()
          .exec();
        const keystore = await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
        return { user: user, keystore: keystore };
      }

      public static async updatePassword(user: User): Promise<any> {
        return UserModel.updateOne({ _id: user._id }, { password: user.password })
          .lean<User>()
          .exec();
      }
    
      public static async updateInfo(user: User): Promise<any> {
        return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
          .lean()
          .exec();
      }
}