import { Types } from 'mongoose';
import RacePoint, { RacePointModel } from '../model/RacePoint';

export default class RacePointRepo {
    
    public static async findByEvent(_id: Types.ObjectId): Promise<RacePoint[]> {
        return RacePointModel.find({ eventId: _id })
        .sort({'_id': -1})
        .lean<RacePoint>()
        .exec();
    }

    public static async findStartAndFinish(_id: Types.ObjectId): Promise<RacePoint[]> {
        return RacePointModel.find({ eventId: _id, 
            $or: [{ type: 'startLine' }, { type: 'finishLine' }]})
            .sort({'_id': -1})
            .lean<RacePoint>()
            .exec();
    }

    public static async create(racePoint: RacePoint): Promise<RacePoint> {
        const createdRacePoint = await RacePointModel.create(racePoint);
        return createdRacePoint.toObject();
    }

    public static async update(racePoint: RacePoint): Promise<any> {
        return RacePointModel.updateOne({ _id: racePoint._id }, { $set: { ...racePoint }})
        .lean<Event>()
        .exec();
    }

    public static async delete(racePoint: RacePoint): Promise<any> {
        return RacePointModel.findOneAndDelete({ _id: racePoint._id })
        .lean<Event>()
        .exec();
    }

    public static async deleteByEvent(_id: Types.ObjectId): Promise<any> {
        return RacePointModel.deleteMany({ eventId: _id })
        .lean<RacePoint>()
        .exec();
    }
}