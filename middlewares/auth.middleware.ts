import {Request, RequestHandler} from "express";
import { UserService } from "../services";
import {AuthUtil} from "../utils";

const jwt = require('jsonwebtoken')

export function checkAuth(): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const token = AuthUtil.getToken(req.headers.authorization);

            jwt.verify(token, process.env.SECRET);
            const user = jwt.decode(token, {complete: false})

            req.body.user =  await UserService.getInstance().getOneById(user.id);

            next();
        } catch(err) {
            res.status(401).send({ error: 'Invalid or missing bearer token' }).end();
        }
    }
}