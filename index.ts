import { config } from "dotenv";
config(); // Permet de charger les variables d'environnement

import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import {
  AuthController,
  BurgerController,
  DrinkController,
  IngredientController,
  MenuController,
  OrderController,
  SnackController,
} from "./controllers";
import { RoleService } from "./services";
import { PromoController } from "./controllers/promo.controller";

async function startServer(): Promise<void> {
  await mongoose.connect(process.env.MONGO_URI, {
    auth: {
      username: process.env.MONGO_USER,
      password: process.env.MONGO_PASSWORD,
    },
  });
  const app = express();
  app.use(bodyParser.json());
  app.use("/ingredient", IngredientController.getInstance().buildRouter());
  app.use("/burger", BurgerController.getInstance().buildRouter());
  app.use("/drink", DrinkController.getInstance().buildRouter());
  app.use("/menu", MenuController.getInstance().buildRouter());
  app.use("/order", OrderController.getInstance().buildRouter());
  app.use("/snack", SnackController.getInstance().buildRouter());
  app.use("/promo", PromoController.getInstance().buildRouter());
  app.listen(process.env.PORT, async function () {
    await bootstrap();
    console.log("Server started on port " + process.env.PORT);
  });
}

async function bootstrap(): Promise<void> {
  const adminRole = await RoleService.getInstance().getByName("admin");
  const preparateurRole = await RoleService.getInstance().getByName(
    "preparateur"
  );
  const customerRole = await RoleService.getInstance().getByName("customer");
  if (!adminRole) {
    await RoleService.getInstance().createRole("admin", [
      "promo-create",
      "promo-update",
      "promo-delete",
      "promo-read",
      "menu-create",
      "menu-update",
      "menu-delete",
      "menu-read",
      "burger-create",
      "burger-read",
      "burger-delete",
      "burger-update",
      "drink-create",
      "drink-read",
      "drink-delete",
      "drink-update",
      "dessert-create",
      "dessert-read",
      "dessert-delete",
      "dessert-update",
    ]);
  }
  if (!preparateurRole) {
    await RoleService.getInstance().createRole("preparateur", [
      "menu-read",
      "commande-read",
    ]);
  }
  if (!customerRole) {
    await RoleService.getInstance().createRole("customer", [
      "burger-read",
      "menu-read",
      "dessert-read",
      "drink-read",
      "promo-read",
    ]);
  }
}

startServer();
