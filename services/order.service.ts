import { BurgerProps, OrderDocument, OrderModel, OrderProps } from "../models";
import {Types, FilterQuery} from 'mongoose';
import { ApiErrorCode } from "../api-error-code.enum";

export class OrderService{

    private static instance: OrderService;
    private constructor(){}
    public static getInstance(): OrderService{
        if(OrderService.instance === undefined){
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }

    async createOrder(create:OrderCreate):Promise<OrderDocument | ApiErrorCode>{
        try {
        const model = new OrderModel(create);
        const order = await model.save();
        return order;
        } catch(err) {
            return ApiErrorCode.invalidParameters;
        }
    }
    async getOrderByName(number:string): Promise<OrderDocument | ApiErrorCode>{;
        if(!Types.ObjectId.isValid(number)) {;
            return ApiErrorCode.invalidParameters;
        };
        const order = await OrderModel.findOne({number});
        if(order === null){;
            return ApiErrorCode.notFound;
        };
        return order;
    };
};

export interface OrderCreate{
   readonly foods: BurgerProps[]
   readonly number: Number;
   readonly date: Date;
   readonly price: Number;
}