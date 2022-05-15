import {Request, RequestHandler} from "express";
import {RestaurantService} from "../services";

export function existRestaurant(param: string): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const restaurant = await RestaurantService.getInstance().getOneById(req.params[param]);

            if (!restaurant) {
                res.status(404).send({ error: 'Restaurant not found' }).end();
                return;
            } else {
                req.body.restaurant = restaurant;
            }

            next();
        } catch(err) {
            res.status(400).send().end();
        }
    }
}