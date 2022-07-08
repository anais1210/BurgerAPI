import {
  BurgerDocument,
  BurgerProps,
  OrderDocument,
  OrderModel,
  OrderProps,
} from "../models";
import { Types, FilterQuery } from "mongoose";
import { ApiErrorCode } from "../api-error-code.enum";
import { BurgerService } from "./burger.service";
import { IngredientService, IngredientUpdate } from "./ingredient.service";
import { Util } from "../utils";
import { SnackService, SnackUpdate } from "./snack.service";
import { DrinkService, DrinkUpdate } from "./drink.service";

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
      const drink = await DrinkService.getInstance().getDrinkById(food);
      const snack = await SnackService.getInstance().getSnackById(food);

      if (burger !== null || drink !== null || snack !== null) {
        total += burger.price + drink.price + snack.price;
      }
    }
    return total;
  }

  async updateQuantity(foods: string[]): Promise<void> {
    let id: string;
    for (id of foods) {
      const burger = await BurgerService.getInstance().getBurgerById(id);
      // const drink = await DrinkService.getInstance().getDrinkById(id);
      // const snack = await SnackService.getInstance().getSnackById(id);
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
      // const newQuantityDrink: DrinkUpdate = {
      //   quantity: drink["quantity"] - 1,
      // };
      // await DrinkService.getInstance().updateDrink(
      //   drink["id"],
      //   newQuantityDrink
      // );
      // const newQuantitySnack: SnackUpdate = {
      //   quantity: snack["quantity"] - 1,
      // };
      // await SnackService.getInstance().updateSnack(
      //   snack["id"],
      //   newQuantitySnack
      // );
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
