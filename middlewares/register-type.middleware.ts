import {Request, RequestHandler} from "express";
import {AuthUtil} from "../utils";

const jwt = require('jsonwebtoken')

export function checkRegisterType(): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const body = req.body
            const error: Record<string, any> = {};

            if(!body.login) {
                error.login = "missing parameter"
            }
            if(!body.password) {
                error.password = "missing parameter"
            }
            if(!body.type) {
                error.type = "missing parameter"
            } else {
                if ((body.type === 2 || body.type === 3) && !body.restaurant) {
                    error.restaurant = "missing parameter"
                } else if ((body.type === 4) && body.restaurant){
                    res.status(400).end();
                    return;
                }
            }

            if (Object.keys(error).length !== 0) {
                res.status(400).send(error).end();
                return;
            }

            if (body.type === 1) {
                res.status(401).send({ error: 'Access restricted' }).end();
                return;
            } else if (body.type === 2 || body.type === 3) {
                const token = AuthUtil.getToken(req.headers.authorization);
                jwt.verify(token, process.env.SECRET);
                const user = jwt.decode(token, {complete: false})

                if ((body.type === 2 && user.type !== 1) ||
                    (body.type === 3 && (user.type !== 1 && user.type !== 2))) {
                    res.status(401).send({ error: 'Access restricted' }).end();
                    return;
                }
            }

            next();
        } catch(err) {
            res.status(401).send({ error: 'Access restricted' }).end();
        }
    }
}