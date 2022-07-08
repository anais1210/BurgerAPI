import { BurgerProps, OrderDocument, OrderModel, OrderProps } from "../models";
import { Types, FilterQuery } from "mongoose";
import { ApiErrorCode } from "../api-error-code.enum";
import { BurgerService } from "./burger.service";
import { IngredientService, IngredientUpdate } from "./ingredient.service";
import { Util } from "../utils";

export class OrderService {
  private static instance: OrderService;
  private constructor() {}
  public static getInstance(): OrderService {
    if (OrderService.instance === undefined) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async searchOrder(
    search: OrderSearch
  ): Promise<OrderDocument[] | ApiErrorCode> {
    const filter: FilterQuery<OrderDocument> = {};
    if (search.number !== undefined) {
      filter.number = {
        $gte: search.number,
      };
    }

    if (search.price !== undefined) {
      filter.price = {
        $gte: search.price,
      };
    }

    if (search.status !== undefined) {
      const testBool = search.status.toString() === "true" ? false : true;
      filter.status = {
        $ne: testBool,
      };
    }

    const query = OrderModel.find(filter);
    if (search.limit !== undefined) {
      query.limit(search.limit);
    }

    if (search.offset !== undefined) {
      query.skip(search.offset);
    }

    return query.exec();
  }

  async getOrderById(id: string): Promise<OrderDocument | ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const order = await OrderModel.findById(id);
    if (order === null) {
      return null;
    }
    return order;
  }

  async getPrice(foods: any): Promise<number> {
    let total = 0;
    for (const food of foods) {
      const burger = await BurgerService.getInstance().getBurgerById(food);
      if (burger !== null) {
        total += burger.price;
      }
    }
    return total;
  }

  async updateQuantity(foods: string[]): Promise<void> {
    let id: string;
    for (id of foods) {
      const burger = await BurgerService.getInstance().getBurgerById(id);
      const ingredients = JSON.parse(JSON.stringify(burger.products));
      for (const ingredient of ingredients) {
        const quantityBefore =
          await IngredientService.getInstance().getIngredientById(
            ingredient["ingredient"]
          );
        const newQuantity: IngredientUpdate = {
          quantity: quantityBefore["quantity"] - ingredient["quantity"],
        };
        await IngredientService.getInstance().updateIngredient(
          ingredient["ingredient"],
          newQuantity
        );
      }
    }
  }
  async createOrder(foods: string[]): Promise<OrderDocument | ApiErrorCode> {
    try {
      const order = {
        foods: foods,
        number: Util.generateNumber(),
        date: new Date(),
        price: await this.getPrice(foods),
        status: false,
      };
      const model = new OrderModel(order);
      await this.updateQuantity(foods);
      return await model.save();
    } catch (err) {
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
  async updateOrder(
    id: string,
    update: OrderUpdate
  ): Promise<OrderDocument | ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const burger = await OrderModel.findByIdAndUpdate(id, update, {
      returnDocument: "after",
    });
    if (burger === null) {
      return ApiErrorCode.notFound;
    }
    return burger;
  }
}

export interface OrderCreate {
  readonly foods: string[];
  readonly number: number;
  readonly date: Date;
  readonly price: number;
  readonly status: boolean;
}

export interface OrderUpdate {
  readonly foods?: string[];
  readonly number?: number;
  readonly date?: Date;
  readonly price?: number;
  readonly status?: boolean;
}
export interface OrderSearch {
  readonly foods?: string[];
  readonly number?: number;
  readonly date?: string;
  readonly price?: number;
  readonly status?: boolean;
  readonly limit?: number;
  readonly offset?: number;
}
