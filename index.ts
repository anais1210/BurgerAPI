import {config} from "dotenv";
config(); // Permet de charger les variables d'environnement

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from "mongoose";
import {AuthController} from "./controllers";
import {RoleService} from "./services";

async function startServer(): Promise<void> {
    await mongoose.connect(process.env.MONGO_URI, {
        auth: {
            username: process.env.MONGO_USER,
            password: process.env.MONGO_PASSWORD
        }
    });
    const app = express();
    app.use(bodyParser.json());
    app.use('/auth', AuthController.getInstance().buildRouter());
    app.listen(process.env.PORT, async function() {
        await bootstrap();
        console.log("Server started on port " + process.env.PORT);
    });
}

async function bootstrap(): Promise<void> {
    const adminRole = await RoleService.getInstance().getByName("admin");
    if(!adminRole) {
        await RoleService.getInstance().createRole("admin", [
            "burger-create",
            "burger-read",
            "burger-delete",
            "burger-update"
        ]);
    }
}

startServer()


