import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";
export type OrderStatus = "received" | "preparing" | "complete";

export interface ItemsProps {
  itemId: string;
  quantity: number;
}
export interface OrderProps {
  _id: string;
  products: ItemsProps[];
  number: number;
  date: Date;
  total: number;
  menu?: ItemsProps[];
  status: OrderStatus;
  name: string;
  email: string;
}

export type OrderDocument = OrderProps & Document;

const OrderSchema = new Schema(
  {
    products: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "Products",
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],

    number: {
      type: Schema.Types.Number,
      unique: true,
    },
    date: {
      type: Schema.Types.Date,
    },
    total: {
      type: Schema.Types.Number,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      enum: ["received", "preparing", "complete"],
      required: true,
      default: "received",
    },
    menu: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "Menu",
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    name: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    versionKey: false,
    collection: "orders",
    timestamps: true,
  },
);

export const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);
