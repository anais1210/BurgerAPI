import * as express from "express";
export class PromoController {
  private static instance: PromoController;
  public static getInstance(): PromoController {
    if (PromoController.instance === undefined) {
      PromoController.instance = new PromoController();
    }
    return PromoController.instance;
  }
  private constructor() {}
  buildRouter(): express.Router {
    const router = express.Router(); // création d'un nouveau router
    // router.post("/createOrder", express.json(), this.createOrder.bind(this));
    // router.get("/:id", this.getOrderById.bind(this));
    // router.delete("/:id", this.deleteOrder.bind(this));
    // router.patch("/:id", this.updateOrder.bind(this));
    return router;
  }
}
