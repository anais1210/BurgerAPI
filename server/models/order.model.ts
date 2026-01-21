import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";
export type OrderStatus = "received" | "preparing" | "ready";

export interface OrderProductItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderMealItem {
  mealId: string;
  name: string;
  price: number;
  quantity: number;
  selectedProducts: {
    productId: string;
    name: string;
  }[];
}

export interface OrderProps {
  _id: string;
  orderNumber: number;
  products: OrderProductItem[];
  meals: OrderMealItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderDocument = OrderProps & Document;

const OrderSchema = new Schema(
  {
    orderNumber: {
      type: Schema.Types.Number,
      unique: true,
    },
    products: [
      {
        productId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    meals: [
      {
        mealId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        selectedProducts: [
          {
            productId: {
              type: String,
              required: true,
            },
            name: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
    total: {
      type: Schema.Types.Number,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      enum: ["received", "preparing", "ready"],
      required: true,
      default: "received",
    },
    customerName: {
      type: Schema.Types.String,
      required: true,
    },
    customerEmail: {
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

// Drop old 'number' index if it exists (from previous schema)
OrderModel.collection.dropIndex("number_1").catch(() => {
  // Index doesn't exist, ignore the error
});
