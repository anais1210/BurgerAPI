import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";
import { BurgerDocument } from "./burger.model";

export interface MenuProps {
  _id: string;
  name: string;
  burger: string;
  drink: string;
  snack: string;
  price: number;
}

export type MenuDocument = MenuProps & Document;

const MenuSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    burger: {
      type: Schema.Types.String,
      required: true,
    },
    drink: {
      type: Schema.Types.String,
      required: true,
    },
    snack: {
      type: Schema.Types.String,
      required: true,
    },
    price: {
      type: Schema.Types.Number,
      required: true,
    },
  },
  {
    versionKey: false,
    collection: "Menus",
    timestamps: true,
  }
);

export const MenuModel = mongoose.model<MenuDocument>("Menu", MenuSchema);
