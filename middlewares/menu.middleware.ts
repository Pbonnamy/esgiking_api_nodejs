import {Request, RequestHandler} from "express";
import {DishService} from "../services";

export function checkMenu(all: boolean = false): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const body = req.body;
            const error: Record<string, any> = {};
            const dishes = [];

            if (all) {
                if(!body.name) {
                    error.name = "missing parameter"
                }

                if(!body.price) {
                    error.price = "missing parameter"
                }

                if(!body.dishes) {
                    error.dishes = "missing parameter"
                }
            }

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