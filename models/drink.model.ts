import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface DrinkProps {
  _id: string;
  name: string;
  price: number;
  availability: number;
}

export type DrinkDocument = DrinkProps & Document;

const drinkSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    price: {
      type: Schema.Types.Number,
      required: true,
      default: 0,
    },
    availability: {
      type: Schema.Types.Boolean,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export const DrinkModel = mongoose.model<DrinkDocument>("Drink", drinkSchema);
