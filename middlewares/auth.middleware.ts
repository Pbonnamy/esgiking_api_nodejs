import {Request, RequestHandler} from "express";
import {AuthUtil} from "../utils";

const jwt = require('jsonwebtoken')

//user authenticated
export function checkAuth(): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const token = AuthUtil.getToken(req.headers.authorization);

            jwt.verify(token, process.env.SECRET);

            next();
        } catch(err) {
            res.status(401).send({ error: 'Invalid or missing bearer token' }).end();
        }
    }
}