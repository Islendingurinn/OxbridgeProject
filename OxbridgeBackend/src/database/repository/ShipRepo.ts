import { Types } from 'mongoose';
import Ship, { ShipModel } from '../model/Ship';

export default class ShipRepo {

    public static async findAll(): Promise<Ship[]> {
        return ShipModel.find({ })
        .lean<Ship>()
        .exec();
    }

    public static async findById(_id: Types.ObjectId): Promise<Ship | null> {
        return ShipModel.findOne({ _id: _id })
        .lean<Ship>()
        .exec();
    }

    public static async findByUser(_id: Types.ObjectId): Promise<Ship[]> {
        return ShipModel.find({ _id: _id})
        .lean<Ship>()
        .exec();
    }

    public static async findByUserAndPopulate(_id: Types.ObjectId): Promise<Ship[]> {
        return ShipModel.find({ _id: _id})
        .lean<Ship>()
        .exec();
    }

    public static async create(ship: Ship): Promise<Ship> {
        const createdShip = await ShipModel.create(ship);
        return createdShip.toObject();
    }

    public static async update(ship: Ship): Promise<any> {
        return ShipModel.updateOne({ _id: ship._id }, { $set: { ...ship }})
        .lean<Ship>()
        .exec();
    }

    public static async delete(ship: Ship): Promise<any> {
        return ShipModel.findOneAndDelete({ _id: ship._id })
        .lean<Ship>()
        .exec();
    }
}