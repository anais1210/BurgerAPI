import * as express from "express";
import { ProductService } from "../services";
import { ApiErrorCode } from "../api-error-code.enum";
import { checkUserConnected } from "../middlewares";
import { checkUserAccess } from "../middlewares/role.middleware";
import { validate, ValidationError } from "../utils/validation.utils";

/**
 * Chaque controlleur aura son propre routeur à construire
 */

export class ProductController {
  // -- DESIGN PATTERN SINGLETON
  //Permet d'avoir une seule instance d'une classe au maximum
  private static instance: ProductController;

  public static getInstance(): ProductController {
    if (ProductController.instance === undefined) {
      ProductController.instance = new ProductController();
    }
    return ProductController.instance;
  }

  private constructor() {}
  // -------

  async searchProduct(req: express.Request, res: express.Response) {
    const limit = req.query.limit
      ? Number.parseInt(req.query.limit as string)
      : 20; //number
    const offset = req.query.offset
      ? Number.parseInt(req.query.offset as string)
      : 0; // number
    const availability = req.query.availability
      ? req.query.availability === "true"
      : undefined; // number
    const price = req.query.price
      ? Number.parseInt(req.query.price as string)
      : undefined; // number
    const Products = await ProductService.getInstance().searchProducts({
      name: req.query.name as string,
      availability: availability,
      price: price,
      limit: limit,
      offset: offset,
    });
    res.json(Products);
  }
  async getProductById(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await ProductService.getInstance().getProductById(id);
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    }
    res.json(result);
  }

  async createProduct(req: express.Request, res: express.Response) {
    try {
      const data = req.body;
      validate.required(data.name, "name");
      validate.string(data.name, "name");
      validate.required(data.price, "price");
      validate.number(data.price, "price", { min: 0 });
      if (data.products !== undefined) {
        validate.array(data.products, "products");
      }

      const result = await ProductService.getInstance().createProduct(data);
      if (result === ApiErrorCode.alreadyExists) {
        return res.status(409).end();
      }
      if (result === ApiErrorCode.invalidParameters) {
        return res.status(400).end();
      }
      res.json(result);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).end();
    }
  }

  async deleteProduct(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await ProductService.getInstance().deleteProduct(id);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    }
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.status(204).end();
  }

  async updateProduct(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const data = req.body;
    const result = await ProductService.getInstance().updateProduct(id, data);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    }
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.json(result);
  }

  buildRouter(): express.Router {
    const router = express.Router(); //création d'un nouveau routeur
    router.get("/", this.searchProduct.bind(this));
    router.get("/:id", this.getProductById.bind(this));
    router.post(
      "/",
      checkUserConnected(),
      checkUserAccess(["product-create"]),
      this.createProduct.bind(this),
    );
    router.delete(
      "/:id",
      checkUserConnected(),
      checkUserAccess(["product-delete"]),
      this.deleteProduct.bind(this),
    );
    router.patch(
      "/:id",
      checkUserConnected(),
      checkUserAccess(["product-update"]),
      this.updateProduct.bind(this),
    );
    return router;
  }
}
