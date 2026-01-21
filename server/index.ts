import { config } from "dotenv";
config();
import cors from "cors";
import * as bodyParser from "body-parser";
import mongoose from "mongoose";

import {
  AuthController,
  ProductController,
  MealController,
  OrderController,
} from "./controllers";
import { RoleService } from "./services";
import express from "express";

async function startServer(): Promise<void> {
  await mongoose.connect(process.env.MONGO_URI);
  const app = express();
  const allowedOrigins =
    process.env.NODE_ENV === "production"
      ? process.env.ALLOWED_ORIGINS_PROD?.split(",")
      : process.env.ALLOWED_ORIGINS_DEV?.split(",") || [
          "http://localhost:5173",
        ];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );

  app.use(bodyParser.json());
  app.use("/product", ProductController.getInstance().buildRouter());
  app.use("/meal", MealController.getInstance().buildRouter());
  app.use("/order", OrderController.getInstance().buildRouter());
  app.use("/user", AuthController.getInstance().buildRouter());
  app.listen(process.env.PORT, async function () {
    await bootstrap();
    console.log("Server started on port " + process.env.PORT);
  });
}

async function bootstrap(): Promise<void> {
  console.log("MongoDB connected");

  const resources = ["product", "meal", "order", "user"];

  // Génération CRUD
  const generateCrudPermissions = (resources: string[]) => {
    const actions = ["create", "read", "update", "delete"];
    return resources.flatMap((r) => actions.map((a) => `${r}-${a}`));
  };

  const adminPermissions = generateCrudPermissions(resources);

  // Récupération des rôles existants
  const roleService = RoleService.getInstance();
  const adminRole = await roleService.getByName("admin");
  const customerRole = await roleService.getByName("customer");

  // ADMIN
  if (!adminRole) {
    await roleService.createRole("admin", adminPermissions);
    console.log("Admin role created");
  }

  // CUSTOMER
  if (!customerRole) {
    await roleService.createRole("customer", ["product-read", "meal-read"]);
    console.log("Customer role created");
  }
}

startServer();
