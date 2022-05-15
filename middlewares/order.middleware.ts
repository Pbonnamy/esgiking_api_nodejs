import {Request, RequestHandler} from "express";
import {DishService, RestaurantService, UserService} from "../services";

export function checkOrder(partial: boolean = true): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const restaurant = await RestaurantService.getInstance().getOneById(req.params.restaurant);

            if(!restaurant) {
                res.status(404).send({error : "Restaurant not found"}).end();
                return;
            } else {
                req.body.restaurant = restaurant;
            }

            const body = req.body;
            const error: Record<string, any> = {};
            const dishes = [];

            if (body.dishes && !Array.isArray(body.dishes)) {
                error.dishes = "wrong parameter";
            } else if (body.dishes) {
                error.dishes = {};

                for (const id of body.dishes) {
                    const dish = await DishService.getInstance().getOneById(id);
                    if (!dish) {
                        error.dishes[id] = "not found";
                    } else {
                        dishes.push(dish);
                    }
                }

                if (Object.keys(error.dishes).length === 0) {
                    delete error.dishes
                }

                if (dishes.length !== 0) {
                    req.body.dishes = dishes;
                }
            }

            let user = null;

            if (!partial) {
                if (!body.client) {
                    error.client = "missing parameter";
                }else {
                    user = await UserService.getInstance().getOneById(body.client);
                    await user?.populate("type");

                    if (!user || user.type._id !== 4) {
                        error.client = "not found";
                    } else {
                        req.body.client= user;
                    }
                }
            }

            if (Object.keys(error).length !== 0) {
                res.status(400).send(error).end();
                return;
            }

            next();
        } catch(err) {
            res.status(400).send().end();
        }
    }
}