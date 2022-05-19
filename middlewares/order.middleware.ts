import {Request, RequestHandler} from "express";
import {DishService, MenuService} from "../services";

export function checkOrder(): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const body = req.body;
            const error: Record<string, any> = {};

            if (body.dishes) {
                const dishes = await DishService.getInstance().verifyDishes(body);

                if (dishes.error) {
                    error.dishes = dishes.error
                }else {
                    req.body.dishes = dishes.dishes
                }
            }

            if(body.menus) {
                const menus = await MenuService.getInstance().verifyMenus(body);

                if (menus.error) {
                    error.menus = menus.error
                }else {
                    req.body.menus = menus.menus
                }
            }

            if (Object.keys(error).length !== 0) {
                res.status(400).send(error).end();
                return;
            }

            if (body.status && body.user.type._id === 4) {
                res.status(401).send({ error: 'Access restricted' }).end();
                return;
            }

            next();
        } catch(err) {
            res.status(400).send().end();
        }
    }
}