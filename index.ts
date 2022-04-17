import {config} from "dotenv";
config(); //Permet de charger les variables d'environnement

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import {BurgerController, DrinkController, IngredientController} from "./controllers";
import {IngredientModel} from "./models";
import {Mongoose} from "mongoose";

async function startServer(): Promise<void> {
    await mongoose.connect(process.env.MONGO_URI,{
        auth: {
            username: process.env.MONGO_USER,
            password: process.env.MONGO_PASSWORD
        }
    });

    const app = express();

    //Permet de lire les body de requete en JSON
    app.use(bodyParser.json());

    //Permet d'enregistrer un controlleur qui est dans un autre fichier dans le serveur express
    app.use('/ingredient', IngredientController.getInstance().buildRouter());
    app.use('/burger', BurgerController.getInstance().buildRouter());
    app.use('/drink', DrinkController.getInstance().buildRouter());

    //Pour récupérer les variables d'env, il faut utiliser process.env.VARIABLE
    app.listen(process.env.PORT, function(){
        console.log("Server started on port " + process.env.PORT);
    });

}

startServer();
