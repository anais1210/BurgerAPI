import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";
import { ProductProps } from "./product.model";

export interface MenuProps {
  _id: string;
  name: string;
  description?: string;
  products: ProductProps[];
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
    products: {
      type: Schema.Types.ObjectId,
      ref: "Products",
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
