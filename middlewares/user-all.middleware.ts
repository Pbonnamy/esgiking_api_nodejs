import {Request, RequestHandler} from "express";
import {AuthUtil} from "../utils";
import {UserService} from "../services";

const jwt = require('jsonwebtoken')

export function checkAllUsers(): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const token = AuthUtil.getToken(req.headers.authorization);
            jwt.verify(token, process.env.SECRET);
            const user = jwt.decode(token, {complete: false})

            const userData = await UserService.getInstance().getOneById(user.id);

            if (user.type === 2 && (!req.query.restaurant || userData?.restaurant?._id.toString() !== req.query.restaurant)) {
                res.status(401).send({ error: 'Access restricted' }).end();
                return;
            }

            next();
        } catch(err) {
            res.status(401).send({ error: 'Access restricted' }).end();
        }
    }
}