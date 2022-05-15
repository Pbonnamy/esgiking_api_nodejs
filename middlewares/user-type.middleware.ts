import {Request, RequestHandler} from "express";

export function checkUserType(types: Array<Number>): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            if(types.includes(req.body.user.type._id)) {
                next();
            } else {
                res.status(401).send({ error: 'Access restricted' }).end();
            }
        } catch(err) {
            res.status(401).send({ error: 'Invalid bearer token' }).end();
        }
    }
}