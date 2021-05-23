import { model, Schema, Document, Types } from 'mongoose';

export const DOCUMENT_NAME = 'EventRegistration';
export const COLLECTION_NAME = 'event_registration';

export default interface EventRegistration extends Document {
    shipId: Types.ObjectId;
    eventId: Types.ObjectId;
    trackColor: string;
    teamName: string;
}

const EventRegistrationSchema = new Schema({
    shipId : Types.ObjectId,
    eventId : Types.ObjectId,
    trackColor : String,
    teamName : String
});

export const EventRegistrationModel = model<EventRegistration>(DOCUMENT_NAME, EventRegistrationSchema, COLLECTION_NAME);