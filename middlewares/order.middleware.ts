import {Request, RequestHandler} from "express";
import {DishService, RestaurantService} from "../services";

export function checkOrder(): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const body = req.body;

            const dishes = await DishService.getInstance().verifyDishes(body);

            if (dishes.error) {
                res.status(400).send({dishes : dishes.error}).end();
                return;
            }else {
                req.body.dishes = dishes.dishes
            }

            next();
        } catch(err) {
            console.log(err)
            res.status(400).send().end();
        }
    }
}