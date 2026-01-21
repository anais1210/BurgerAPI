import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

// A slot defines what type of product and how many
export interface MealSlot {
  category: "burger" | "snack" | "drink" | "dessert";
  quantity: number;
}

export interface MealProps {
  _id: string;
  name: string;
  description?: string;
  slots: MealSlot[]; // e.g., [{ category: "burger", quantity: 1 }, { category: "drink", quantity: 1 }]
  price: number;
  imageUrl?: string;
}

export type MealDocument = MealProps & Document;

const MealSlotSchema = new Schema(
  {
    category: {
      type: Schema.Types.String,
      enum: ["burger", "snack", "drink", "dessert"],
      required: true,
    },
    quantity: {
      type: Schema.Types.Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const MealSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    description: {
      type: Schema.Types.String,
    },
    slots: {
      type: [MealSlotSchema],
      required: true,
      validate: {
        validator: function (v: MealSlot[]) {
          return v && v.length > 0;
        },
        message: "A meal must have at least one slot",
      },
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
    collection: "Meals",
    timestamps: true,
  }
);

export const MealModel = mongoose.model<MealDocument>("meal", MealSchema);
