import * as mongoose from "mongoose";
import {Schema, Document} from 'mongoose';
import { BurgerDocument} from "./burger.model";

export interface OrderProps {
    _id: string;
    foods: string[];
    number:number;
    date:Date;
    price: number;
    status: boolean;
}

export type OrderDocument = OrderProps & Document;

const OrderSchema = new Schema({
    foods:[{
        type: Schema.Types.ObjectId,
        ref:'Burger',
        required: true,
    }],
    number:{
        type:Schema.Types.Number,
        unique:true
    },
    date:{
        type: Schema.Types.Date
    },
    price:{
        type: Schema.Types.Number
    },
     status:{
        type: Schema.Types.Boolean
    },
}, {
    versionKey: false
});

export const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);