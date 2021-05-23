import { model, Schema, Document } from 'mongoose';

export const DOCUMENT_NAME = 'Event';
export const COLLECTION_NAME = 'events';

export default interface Event extends Document {
    name: string;
    eventStart: Date;
    eventEnd: Date;
    city: string;
    eventCode: string;
    actualEventStart: Date;
    isLive: boolean;
}

const EventSchema = new Schema({
    name: String, 
    eventStart: Date,
    eventEnd: Date,
    city: String,
    eventCode: String,
    actualEventStart : Date,
    isLive : Boolean
});

export const EventModel = model<Event>(DOCUMENT_NAME, EventSchema, COLLECTION_NAME);