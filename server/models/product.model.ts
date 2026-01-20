import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export type Category = "burger" | "drink" | "snack" | "dessert";

export interface ProductProps {
  _id: string;
  name: string;
  description?: string;
  category?: Category;
  avaibility: boolean;
  price: number;
  imageUrl?: string;
}

export type ProductDocument = ProductProps & Document;

const ProductSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
    },
    category: {
      type: Schema.Types.String,
      enum: ["burger", "drink", "snack", "dessert"],
    },
    avaibility: {
      type: Schema.Types.Boolean,
      default: true,
    },
    price: {
      type: Schema.Types.Number,
      default: 0,
      required: true,
    },

    imageUrl: {
      type: Schema.Types.String,
    },
  },
  {
    versionKey: false,
  },
);

export const ProductModel = mongoose.model<ProductDocument>(
  "Product",
  ProductSchema,
);
