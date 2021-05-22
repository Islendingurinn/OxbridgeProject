import { model, Schema, Document, Types} from 'mongoose';

export const DOCUMENT_NAME = 'LocationRegistration';
export const COLLECTION_NAME = 'location_registration';

export default interface LocationRegistration extends Document {
    eventRegId: Types.ObjectId;
    racePointId : Types.ObjectId;
    locationTime: Date;
    longtitude: number;
    latitude: number;
    raceScore: number;
    finishTime: Date;
}

const LocationRegistrationSchema = new Schema({
    eventRegId: Types.ObjectId,
    racePointId : Types.ObjectId,
    locationTime: Date,
    longtitude: Number,
    latitude: Number,
    raceScore : Number,
    finishTime : Date,
});

export const LocationRegistrationModel = model<LocationRegistration>(DOCUMENT_NAME, LocationRegistrationSchema, COLLECTION_NAME);