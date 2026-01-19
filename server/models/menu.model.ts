import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface MenuProps {
  _id: string;
  name: string;
  burger: string;
  description?: string;
  drink: string;
  snack: string;
  price: number;
  imageUrl?: string;
}

export type MenuDocument = MenuProps & Document;

const MenuSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    description: {
      type: Schema.Types.String,
    },
    burger: {
      type: Schema.Types.ObjectId,
      ref: "Burger",
      required: true,
    },
    drink: {
      type: Schema.Types.ObjectId,
      ref: "Drink",
    },
    snack: {
      type: Schema.Types.ObjectId,
      ref: "Snack",
    },
    price: {
      type: Schema.Types.Number,
      required: true,
    },
    imageUrl: {
      type: Schema.Types.String,
    },
  },
  {
    versionKey: false,
    collection: "Menus",
    timestamps: true,
  },
);

export const MenuModel = mongoose.model<MenuDocument>("Menu", MenuSchema);
