import * as mongoose from "mongoose";
import {Schema, Document} from 'mongoose';

export interface OrderProps {
    _id: string;
    userId:string;
    accessList: string[];
    parent: string|OrderProps;
}

export type OrderDocument = OrderProps & Document;

const orderSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    userId:{
        type:Schema.Types.String,
        required:true
    },
    accessList: [{
        type: Schema.Types.String,
        required: true,
    }],
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Order"
    }
}, {
    versionKey: false
});

export const OrderModel = mongoose.model<OrderDocument>("Order", orderSchema);
