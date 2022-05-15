import {Request, RequestHandler} from "express";
import {AuthUtil} from "../utils";
import {RestaurantService, UserService} from "../services";
import {UserTypeModel} from "../models";
import { userInfo } from "os";

const jwt = require('jsonwebtoken')

export function checkRegisterType(): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const body = req.body
            const error: Record<string, any> = {};
            
            if(!body.login) {
                error.login = "missing parameter"
            } else {
                const user = await UserService.getInstance().getOneByLogin(body.login);

                if (user.length) {
                    error.login = "already exist"
                }
            }

            if(!body.password) {
                error.password = "missing parameter"
            }

            if(!body.type) {
                error.type = "missing parameter"
            } else {
                const exist = await UserTypeModel.findById(body.type);

                if(!exist) {
                    res.status(400).end();
                    return;
                } else {
                    if (body.type === 1) {
                        res.status(401).send({ error: 'Access restricted' }).end();
                        return;
                    }else if (body.type === 2 || body.type === 3) {

                        const token = AuthUtil.getToken(req.headers.authorization);
                        jwt.verify(token, process.env.SECRET);
                        const user = jwt.decode(token, {complete: false})

                        if ((body.type === 2 && user.type !== 1) ||
                            (body.type === 3 && (user.type !== 1 && user.type !== 2))) {
                            res.status(401).send({ error: 'Access restricted' }).end();
                            return;
                        }

                        console.log(user.type)
                        if (user.type === 1) {
                            if (!body.restaurant) {
                                error.restaurant = "missing parameter"
                            } else {
                                const restaurant = await RestaurantService.getInstance().getOneById(body.restaurant);
                                if(!restaurant) {
                                    error.restaurant = "not found";
                                }
                            }
                        } else {
                            const userData = await UserService.getInstance().getOneById(user.id);

                            body.restaurant = userData?.restaurant;
                        }
                    } else if ((body.type === 4) && body.restaurant){
                        res.status(400).end();
                        return;
                    }
                }

            }

            if (Object.keys(error).length !== 0) {
                res.status(400).send(error).end();
                return;
            }

            next();
        } catch(err) {
            res.status(401).send({ error: 'Access restricted' }).end();
        }
    }
}