import * as express from 'express';
import {Types, FilterQuery} from 'mongoose';
import { OrderDocument, OrderModel } from '../models';
import { OrderService } from '../services/order.service';
import { ApiErrorCode } from '../api-error-code.enum';
import { Util } from '../utils';

export class OrderController{

    // ------- design pattern singleton --> permet d'avoir une seule instance d'une classe max ----------
    private static instance: OrderController;
    public static getInstance(): OrderController{
        if (OrderController.instance === undefined){
            OrderController.instance = new OrderController();
        }
        return OrderController.instance;
    }
    private constructor(){}
    
    // -----------------------------------------------------------------------
    
    /*async searchOrder(req: express.Request, res: express.Response){ // ceci est une fonction

        const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 20; // number
        const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : 0; // number
        const proof = req.query.proof ? Number.parseInt(req.query.proof as string) : undefined; // number

        const Orders = await OrderService.getInstance().searchOrder({
            type:req.query.type as string,
            name:req.query.name as string,
            proof:proof,
            limit:limit,
            offset:offset
        });
        res.json(Orders);
    }
    async getOrderById(req:express.Request, res:express.Response){
        const id = req.params.id;
        const result = await OrderService.getInstance().getOrderById(id);
        if(result === ApiErrorCode.notFound){
            return res.status(404).end();
        }else if (result === ApiErrorCode.invalidParameters){
            return res.status(400).end();
        }
        res.json(result);
    }*/
    async getPrice(req:express.Request, res:express.Response){
        const data = req.body;
        let total  = 0;
        for (const food of data.foods) {  
            total += data.foods.price 
          }
        return total;
        
    }

    async createOrder(req:express.Request, res:express.Response){
        const data = req.body;
        const result = await OrderService.getInstance().createOrder({
            foods: [data.foods],
            number: Util.generateNumber(),
            date: new Date(),
            price: Number(this.getPrice),
        });

        if(result === ApiErrorCode.alreadyExists) {
            res.status(409).end(); // CONFLICT
            return;
        }
        res.json("result :" + data);
    }
    /*async deleteOrder(req:express.Request, res:express.Response){;
        const id = req.params.id;
        const result = await OrderService.getInstance().deleteOrder(id);
        if(result === ApiErrorCode.notFound){;
            return res.status(404).end();
        }else if (result === ApiErrorCode.invalidParameters){;
            return res.status(400).end();
        };
        res.status(204).end();
    };

    async updateOrder(req:express.Request, res:express.Response){;
        const id = req.params.id;
        const data = req.body;
        const result = await OrderService.getInstance().updateOrder(id, data);
        if(result === ApiErrorCode.notFound){;
            return res.status(404).end();
        }else if (result === ApiErrorCode.invalidParameters){;
            return res.status(400).end();
        };
        res.json(result);
    };*/

    buildRouter():express.Router{
        const router = express.Router() // création d'un nouveau router
            router.post("/createOrder", this.createOrder.bind(this)); 
           /* router.get("/", this.searchOrder.bind(this)); // bind permet de ne pas perdre le "this" 
            router.get("/:id", this.getOrderById.bind(this)); 
            router.delete("/:id",this.deleteOrder.bind(this)); 
            router.patch("/:id",this.updateOrder.bind(this)); 
            */
            return router;
            
    }

}