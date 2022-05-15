import {Request, RequestHandler} from "express";

export function ownedRestaurant(param: string): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            if ((req.body.user.type._id === 2 || req.body.user.type._id === 3) && req.body.user.restaurant._id.toString() !== req.params[param]) {
                res.status(401).send({ error: 'Access restricted' }).end();
                return;
            }

            next();
        } catch(err) {
            res.status(401).send({ error: 'Access restricted' }).end();
        }
    }
}