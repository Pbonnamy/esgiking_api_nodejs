import {Request, RequestHandler} from "express";
import {AuthUtil} from "../utils";

const jwt = require('jsonwebtoken')

export function checkUserType(types: Array<Number>): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            const extracted = AuthUtil.getToken(req.headers.authorization);
            const content = jwt.decode(extracted, {complete: false})

            if(types.includes(content.type)) {
                next();
            } else {
                res.status(401).send({ error: 'Access restricted' }).end();
            }
        } catch(err) {
            res.status(401).send({ error: 'Invalid bearer token' }).end();
        }
    }
}