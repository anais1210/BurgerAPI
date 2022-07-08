import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface OrderProps {
  _id: string;
  foods: string[];
  number: number;
  date: Date;
  price: number;
  menu: string;
  status: boolean;
  promo: string;
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
    menu: {
      type: Schema.Types.String,
      ref: "Menu",
    },
    status: {
      type: Schema.Types.Boolean,
    },
    promo: {
      type: Schema.Types.ObjectId,
      ref: "Promos",
    },
  },
  {
    versionKey: false,
    collection: "orders",
    timestamps: true,
  }
);

export const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);
