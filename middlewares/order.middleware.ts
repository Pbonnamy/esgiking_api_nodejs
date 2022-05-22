import {Request, RequestHandler} from "express";
import {DishService, MenuService, UserService} from "../services";
import { AuthUtil } from "../utils";

const jwt = require('jsonwebtoken')

export function checkOrder(needAuth: boolean = false): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const body = req.body;
            const error: Record<string, any> = {};

            if (needAuth) {
                if(body.take_away === undefined || typeof body.take_away !== "boolean") {
                    error.take_away = "missing parameter"
                } else if (body.take_away === true) {
                    const token = AuthUtil.getToken(req.headers.authorization);
    
                    jwt.verify(token, process.env.SECRET);
                    const user = jwt.decode(token, {complete: false})
                    req.body.user =  await UserService.getInstance().getOneById(user.id);
    
                    if (req.body.user.type._id !== 4) {
                        res.status(400).end();
                        return;
                    }
                }
            }

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