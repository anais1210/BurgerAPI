import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";
export type OrderStatus = "received" | "preparing" | "finish" | "complete";

export interface ProductItemsProps {
  itemId: string;
  quantity: number;
}

export interface MenuItemsProps {
  item: {
    menuId: string;
    drinkId: string;
    snackId: string;
  };
  quantity: number;
}
export interface OrderProps {
  _id: string;
  orderToken: string;
  burger?: ProductItemsProps[];
  drink?: ProductItemsProps[];
  snack?: ProductItemsProps[];
  number: number;
  date: Date;
  total: number;
  menu?: MenuItemsProps[];
  status: OrderStatus;
  name: string;
  email: string;
}

export type OrderDocument = OrderProps & Document;

const OrderSchema = new Schema(
  {
    orderToken: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    burger: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "Burger",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    drink: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "Drink",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    snack: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "Snack",
          required: true,
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
      enum: ["received", "preparing", "finish", "complete"],
      required: true,
      default: "received",
    },
    menu: [
      {
        item: {
          menuId: { type: Schema.Types.ObjectId, ref: "Menu" },
          drinkMenu: { type: Schema.Types.ObjectId, ref: "Drink" },
          snackMenu: { type: Schema.Types.ObjectId, ref: "Snack" },
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
