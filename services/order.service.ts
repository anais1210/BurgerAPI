import { BurgerProps, OrderDocument, OrderModel, OrderProps } from "../models";
import { Types, FilterQuery } from "mongoose";
import { ApiErrorCode } from "../api-error-code.enum";
import { BurgerService } from "./burger.service";
import { IngredientService, IngredientUpdate } from "./ingredient.service";
import { Util } from "../utils";
import { PromoService } from "./promo.service";
import { MenuService } from "./menu.service";

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
  async getMenuPrice(foods: any): Promise<number> {
    let total = 0;
    for (const food of foods) {
      const menu = await MenuService.getInstance().getMenuById(food);
      if (menu !== null) {
        total += menu.price;
      }
    }
    return total;
  }
  async updateQuantity(foods: string[]): Promise<ApiErrorCode> {
    let id: string;
    for (id of foods) {
      const burger = await BurgerService.getInstance().getBurgerById(id);
      const ingredients = JSON.parse(JSON.stringify(burger.products));
      for (const ingredient of ingredients) {
        const quantityBefore =
          await IngredientService.getInstance().getIngredientById(
            ingredient["ingredient"]
          );

        if (quantityBefore["quantity"] < 0) {
          console.log("failed");

          return ApiErrorCode.failed;
          break;
        } else {
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
  }
  async verifyPromo(code: string, price: number): Promise<Number> {
    if (code !== undefined) {
      const percent = await PromoService.getInstance().getPromoByName(code);
      return (price = Number(price) - (Number(percent) / 100) * Number(price));
    }
    return Number(price);
  }
  async createOrder(
    create: OrderCreate
  ): Promise<OrderDocument | ApiErrorCode> {
    try {
      let price = await this.getPrice(create.foods);
      let menuPrice;
      if (create.menu) {
        menuPrice = await this.getMenuPrice(create.menu);
      } else {
        menuPrice = 0;
      }

      const finalPrice = await this.verifyPromo(create.promo, price);

      const order = {
        foods: create.foods,
        number: Util.generateNumber(),
        date: new Date(),
        promo: create.promo,
        price: Number(finalPrice) + Number(menuPrice),
        menu: create.menu,
        snack: create.snack,
        drink: create.drink,
        status: false,
      };
      const quantity = await this.updateQuantity(create.foods);
      if (quantity === ApiErrorCode.failed) {
        console.log("out of stock");
        return ApiErrorCode.failed;
      } else {
        const model = new OrderModel(order);
        return await model.save();
      }
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
}

export interface OrderCreate {
  readonly foods?: string[];
  readonly number: number;
  readonly date: Date;
  readonly menu?: string[];
  readonly snack?: string;
  readonly drink?: string;
  readonly price: number;
  readonly promo: string;
  readonly status: boolean;
}

export interface OrderUpdate {
  readonly foods?: string[];
  readonly number?: number;
  readonly date?: Date;
  readonly price?: number;
  readonly status?: boolean;
}
