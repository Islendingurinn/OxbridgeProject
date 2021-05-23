import { model, Schema, Document, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Ship';
export const COLLECTION_NAME = 'ships';

export default interface Ship extends Document {
    userId: Types.ObjectId;
    name: string;
}

const ShipSchema = new Schema({
    userId: Types.ObjectId,
    name: String
});

export const ShipModel = model<Ship>(DOCUMENT_NAME, ShipSchema, COLLECTION_NAME);