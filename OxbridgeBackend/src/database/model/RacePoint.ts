import { model, Schema, Document, Types} from 'mongoose';

export const DOCUMENT_NAME = 'RacePoint';
export const COLLECTION_NAME = 'race_points';

export default interface RacePoint extends Document {
    type: string;
    firstLongtitude: number;
    firstLatitude: number;
    secondLongtitude: number;
    secondLatitude: number;
    eventId: Types.ObjectId;
}

const racePointSchema = new Schema({
    type: String, 
    firstLongtitude : Number,
    firstLatitude : Number, 
    secondLongtitude : Number,
    secondLatitude : Number,
    eventId: Types.ObjectId,
});

export const RacePointModel = model<RacePoint>(DOCUMENT_NAME, racePointSchema, COLLECTION_NAME);