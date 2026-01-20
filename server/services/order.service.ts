import { OrderDocument, OrderModel } from "../models";
import { randomUUID } from "crypto";
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
  async getOrders(token?: string) {
    if (token) {
      // si token fourni, filtre par token
      return await OrderModel.find({ orderToken: token })
        .populate("burger.item")
        .populate("drink.item")
        .populate("snack.item")
        .populate("menu.item.menuId")
        .populate("menu.item.drinkMenu")
        .populate("menu.item.snackMenu")
        .exec();
    } else {
      // sinon retourne tous les orders
      return await OrderModel.find()
        .populate("burger.item")
        .populate("drink.item")
        .populate("snack.item")
        .populate("menu.item.menuId")
        .populate("menu.item.drinkMenu")
        .populate("menu.item.snackMenu")
        .exec();
    }
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
      // 3️⃣ Préparer l'objet order pour Mongoose
      const orderData = {
        products: create.products,
        menu: create.menu,
        number: create.number,
        date: new Date(),
        total: create.total,
        status: "received",
        name: create.name,
        email: create.email,
      };

      // 4️⃣ Créer et sauvegarder la commande
      const order = new OrderModel(orderData);
      return await order.save();
    } catch (err) {
      console.error(err);
      return ApiErrorCode.invalidParameters;
    }
  }

  async getOrderByName(number: string): Promise<OrderDocument | ApiErrorCode> {
    if (!Types.ObjectId.isValid(number)) {
      return ApiErrorCode.invalidParameters;
    }
    const order = await OrderModel.findOne({ number });
    if (order === null) {
      return ApiErrorCode.notFound;
    }
    return order;
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
  products?: string[];
  number?: number;
  date?: Date;
  total: number;
  menu?: string[];
  status?: string;
  name: string;
  email: string;
}

export interface OrderUpdate {
  readonly price?: number;
  readonly status?: boolean;
}
