import LocationRegistration, { LocationRegistrationModel } from '../model/LocationRegistration';
import { Types } from 'mongoose';

export default class LocationRegistrationRepo {

    public static async findAll(): Promise<LocationRegistration[]> {
        return LocationRegistrationModel.find({})
        .lean<LocationRegistration>()
        .exec();
    }

    public static async findByEventRegistration(_id: Types.ObjectId): Promise<LocationRegistration[]>{
        return LocationRegistrationModel.find({ eventRegId: _id })
        .lean<LocationRegistration>()
        .exec();
    }

    public static async create(locationRegistration: LocationRegistration): Promise<LocationRegistration> {
        const createdLocationRegistration = await LocationRegistrationModel.create(locationRegistration);
        return createdLocationRegistration.toObject();
    }

    public static async update(locationRegistration: LocationRegistration): Promise<any> {
        return LocationRegistrationModel.updateOne({ _id: locationRegistration._id }, { $set: { ...locationRegistration }})
        .lean<LocationRegistration>()
        .exec();
    }

    public static async delete(locationRegistration: LocationRegistration): Promise<any> {
        return LocationRegistrationModel.findOneAndDelete({ _id: locationRegistration._id })
        .lean<LocationRegistration>()
        .exec();
    }

    public static async deleteFromEventRegistration(_id: Types.ObjectId): Promise<any> {
        return LocationRegistrationModel.deleteMany({ eventRegId: _id })
        .lean<LocationRegistration>()
        .exec();
    }
}