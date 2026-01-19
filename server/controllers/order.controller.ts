import * as express from "express";
import { OrderService } from "../services/order.service";
import { ApiErrorCode } from "../api-error-code.enum";
import { checkUserConnected } from "../middlewares";
import { checkUserAccess } from "../middlewares/role.middleware";
import { validate, ValidationError } from "../utils/validation.utils";

export class OrderController {
  private static instance: OrderController;
  public static getInstance(): OrderController {
    if (OrderController.instance === undefined) {
      OrderController.instance = new OrderController();
    }
    return OrderController.instance;
  }
  private constructor() {}

  // -----------------------------------------------------------------------

  async getOrders(req: express.Request, res: express.Response) {
    const { token } = req.params; // token peut être undefined
    try {
      const orders = await OrderService.getInstance().getOrders(token);
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found" });
      }
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getOrderById(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await OrderService.getInstance().getOrderById(id);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    } else if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.json(result);
  }

  async createOrder(req: express.Request, res: express.Response) {
    try {
      const data = req.body;
      validate.required(data.name, "name");
      validate.string(data.name, "name");
      validate.required(data.email, "email");
      validate.string(data.email, "email");
      if (data.burger !== undefined) {
        validate.array(data.burger, "burger");
      }
      if (data.drink !== undefined) {
        validate.array(data.drink, "drink");
      }
      if (data.snack !== undefined) {
        validate.array(data.snack, "snack");
      }
      if (data.menu !== undefined) {
        validate.array(data.menu, "menu");
      }

      const result = await OrderService.getInstance().createOrder(data);
      if (result === ApiErrorCode.alreadyExists) {
        return res.status(409).end();
      }
      if (result === ApiErrorCode.invalidParameters) {
        return res.status(400).end();
      }
      if (result === ApiErrorCode.failed) {
        return res.status(404).end();
      }
      res.json(result);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).end();
    }
  }

  async deleteOrder(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await OrderService.getInstance().deleteOrder(id);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    } else if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.status(204).end();
  }

  async updateOrder(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const data = req.body;
    const result = await OrderService.getInstance().updateOrder(id, data);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    }
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.json(result);
  }

  buildRouter(): express.Router {
    const router = express.Router(); // création d'un nouveau router
    router.post("/", this.createOrder.bind(this));
    router.get("/:token?", this.getOrders.bind(this));

    router.get(
      "/:id",
      checkUserConnected(),
      checkUserAccess(["commande-read"]),
      this.getOrderById.bind(this),
    );
    router.delete(
      "/:id",
      checkUserConnected(),
      checkUserAccess(["commande-delete"]),
      this.deleteOrder.bind(this),
    );
    router.patch(
      "/:id",
      checkUserConnected(),
      checkUserAccess(["commande-update"]),
      this.updateOrder.bind(this),
    );

    return router;
  }
}
