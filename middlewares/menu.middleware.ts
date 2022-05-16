import {Request, RequestHandler} from "express";
import {DishService} from "../services";

export function checkMenu(all: boolean = false): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const body = req.body;
            const error: Record<string, any> = {};

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

            if (body.dishes) {
                const dishes = await DishService.getInstance().verifyDishes(body);

                if (dishes.error) {
                    error.dishes = dishes.error;
                }else {
                    req.body.dishes = dishes.dishes
                }
            }

            if (Object.keys(error).length !== 0) {
                console.log(error)
                res.status(400).send(error).end();
                return;
            }

            next();
        } catch(err) {
            console.log(err)
            res.status(400).send().end();
        }
    }
}