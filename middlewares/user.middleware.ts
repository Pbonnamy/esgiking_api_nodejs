import {Request, RequestHandler} from "express";
import {AuthUtil} from "../utils";
import {UserService} from "../services";

const jwt = require('jsonwebtoken')

export function checkUser(): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const token = AuthUtil.getToken(req.headers.authorization);
            jwt.verify(token, process.env.SECRET);
            const user = jwt.decode(token, {complete: false})

            if (user.type === 2) {
                const userData = await UserService.getInstance().getOneById(user.id);
                const target = await UserService.getInstance().getOneById(req.params.id);
                if(target?.restaurant?._id.toString() !== userData?.restaurant?._id.toString()) {
                    res.status(401).send({error: 'Access restricted'}).end();
                    return;
                }
            }else if ((user.type === 3 || user.type === 4) && req.params.id !== user.id) {
                res.status(401).send({ error: 'Access restricted' }).end();
                return;
            }

            next();
        } catch(err) {
            res.status(401).send({ error: 'Access restricted' }).end();
        }
    }
}