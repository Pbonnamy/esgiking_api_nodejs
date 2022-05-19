import {config} from "dotenv";
import express from 'express';
import {Request, Response} from "express";
import mongoose from "mongoose";
import {
    AuthController,
    DishController,
    MenuController,
    OrderController,
    RestaurantController,
    UserController
} from "./controllers";
import {SeedUtil} from "./utils";

config();

async function startServer(): Promise<void> {
    const PORT = process.env.PORT

    await mongoose.connect(process.env.MONGO_URI as string, {
        auth: {
            username: process.env.MONGO_USER  as string,
            password: process.env.MONGO_PASSWORD as string
        }
    });

    await SeedUtil.seed(true, true);

    const app = express();
    app.get('/', function (req: Request, res: Response) {
        res.send("Hello world");
    })

    const authController = new AuthController();
    app.use('/auth', authController.buildRoutes())
    const userController = new UserController();
    app.use('/users', userController.buildRoutes());
    const restaurantController = new RestaurantController();
    app.use('/restaurants', restaurantController.buildRoutes());
    const dishController = new DishController();
    app.use('/restaurants', dishController.buildRoutes());
    const orderController = new OrderController();
    app.use('/restaurants', orderController.buildRoutes());
    const menuController = new MenuController();
    app.use('/restaurants', menuController.buildRoutes())


    app.listen(process.env.PORT, function () {
        console.log("Server started & listening on port " + PORT);
    })
}

startServer().catch(console.error);