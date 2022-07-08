import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface OrderProps {
  _id: string;
  foods: string[];
  number: number;
  date: Date;
  price: number;
  menu: string;
  promo: string;
  status: boolean;
}

export type OrderDocument = OrderProps & Document;

const OrderSchema = new Schema(
  {
    foods: [
      {
        type: Schema.Types.ObjectId,
        ref: "Burger",
      },
      // {
      //   type: Schema.Types.ObjectId,
      //   ref: "Drink",
      // },
      // {
      //   type: Schema.Types.ObjectId,
      //   ref: "Snack",
      // },
    ],
    number: {
      type: Schema.Types.Number,
      unique: true,
    },
    date: {
      type: Schema.Types.Date,
    },
    price: {
      type: Schema.Types.Number,
    },
    status: {
      type: Schema.Types.Boolean,
    },
    menu: {
      type: Schema.Types.String,
      ref: "Menu",
    },
    promo: {
      type: Schema.Types.String,
      ref: "Promo",
    },
  },
  {
    versionKey: false,
    collection: "orders",
    timestamps: true,
  }
);

export const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);
