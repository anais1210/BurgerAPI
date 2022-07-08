import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface SnackProps {
  _id: string;
  name: string;
  price: number;
  availability: number;
  //un seul modèle "extra" + rajouter propriété type
}

export type SnackDocument = SnackProps & Document;

const snackSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    availability: {
      type: Schema.Types.Boolean,
      required: true,
    },
    price: {
      type: Schema.Types.Number,
      required: true,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

export const SnackModel = mongoose.model<SnackDocument>("Drink", snackSchema);
