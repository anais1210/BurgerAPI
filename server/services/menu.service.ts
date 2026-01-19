import { MenuDocument, MenuModel } from "../models";
import { Types } from "mongoose";
import { ApiErrorCode } from "../api-error-code.enum";

export class MenuService {
  private static instance: MenuService;
  private constructor() {}
  public static getInstance(): MenuService {
    if (MenuService.instance === undefined) {
      MenuService.instance = new MenuService();
    }
    return MenuService.instance;
  }

  async getAllMenus(): Promise<MenuDocument[] | null> {
    const menu = await MenuModel.find();
    if (menu === null) {
      return null;
    }
    return menu;
  }

  async getMenuById(id: string): Promise<MenuDocument | ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const menu = await MenuModel.findById(id);
    if (menu === null) {
      return ApiErrorCode.notFound;
    }
    return menu;
  }
  async getMenuPrice(foods: any): Promise<number> {
    let total = 0;
    for (const food of foods) {
      const menu = await this.getMenuById(food.menuId);
      if (typeof menu !== "number") {
        total += menu.price;
      }
    }
    return total;
  }

  async createMenu(create: MenuCreate): Promise<MenuDocument | ApiErrorCode> {
    try {
      const model = new MenuModel(create);
      const menu = await model.save();
      return menu;
    } catch (err) {
      return ApiErrorCode.invalidParameters;
    }
  }

  async getMenuByName(name: string): Promise<string | ApiErrorCode> {
    const menu = await MenuModel.findOne({ name });
    if (menu === null) {
      return ApiErrorCode.notFound;
    }
    return name;
  }
  async deleteMenu(id: string): Promise<ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const Menu = await MenuModel.findByIdAndDelete(id);
    if (Menu === null) {
      return ApiErrorCode.notFound;
    }
    return ApiErrorCode.success;
  }
  async updateMenu(
    id: string,
    update: MenuUpdate,
  ): Promise<MenuDocument | ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const burger = await MenuModel.findByIdAndUpdate(id, update, {
      returnDocument: "after",
    });
    if (burger === null) {
      return ApiErrorCode.notFound;
    }
    return burger;
  }
}

export interface MenuCreate {
  readonly name: string;
  readonly burger: string;
  readonly drink?: string;
  readonly snack?: string;
  readonly price: number;
}

export interface MenuUpdate {
  readonly name: string;
  readonly burger: string;
  readonly drink: string;
  readonly snack: string;
  readonly price: number;
}
export interface MenuSearch {
  readonly name?: string;
  readonly burger?: string;
  readonly drink?: string;
  readonly snack?: string;
  readonly price?: number;
  readonly limit?: number;
  readonly offset?: number;
}
