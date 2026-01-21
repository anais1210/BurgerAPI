import {
  OrderDocument,
  OrderModel,
  OrderProductItem,
  OrderMealItem,
  OrderStatus,
} from "../models";
import { Types } from "mongoose";
import { ApiErrorCode } from "../api-error-code.enum";

export class OrderService {
  private static instance: OrderService;
  private constructor() {}
  public static getInstance(): OrderService {
    if (OrderService.instance === undefined) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async getOrderById(id: string): Promise<OrderDocument | ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const order = await OrderModel.findById(id);
    if (order === null) {
      return ApiErrorCode.notFound;
    }
    return order;
  }

  async getOrderByNumber(
    orderNumber: number,
  ): Promise<OrderDocument | ApiErrorCode> {
    const order = await OrderModel.findOne({ orderNumber });
    if (order === null) {
      return ApiErrorCode.notFound;
    }
    return order;
  }

  async getOrders(): Promise<OrderDocument[]> {
    return await OrderModel.find().sort({ createdAt: -1 }).exec();
  }

  async getOrdersByStatus(status: OrderStatus): Promise<OrderDocument[]> {
    return await OrderModel.find({ status }).sort({ createdAt: -1 }).exec();
  }

  async updateOrder(
    id: string,
    update: OrderUpdate,
  ): Promise<OrderDocument | ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const order = await OrderModel.findByIdAndUpdate(id, update, {
      returnDocument: "after",
    });
    if (order === null) {
      return ApiErrorCode.notFound;
    }
    return order;
  }

  async createOrder(
    create: OrderCreate,
  ): Promise<OrderDocument | ApiErrorCode> {
    try {
      // Generate order number (simple incrementing number)
      const lastOrder = await OrderModel.findOne().sort({ orderNumber: -1 });
      const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;

      const orderData = {
        orderNumber,
        products: create.products || [],
        meals: create.meals || [],
        total: create.total,
        status: "received" as OrderStatus,
        customerName: create.customerName,
        customerEmail: create.customerEmail,
      };

      const order = new OrderModel(orderData);
      return await order.save();
    } catch (err) {
      console.error(err);
      return ApiErrorCode.invalidParameters;
    }
  }

  async deleteOrder(id: string): Promise<ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const order = await OrderModel.findByIdAndDelete(id);
    if (order === null) {
      return ApiErrorCode.notFound;
    }
    return ApiErrorCode.success;
  }
}

export interface OrderCreate {
  products?: OrderProductItem[];
  meals?: OrderMealItem[];
  total: number;
  customerName: string;
  customerEmail: string;
}

export interface OrderUpdate {
  readonly status?: OrderStatus;
}
