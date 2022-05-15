import {Request, RequestHandler} from "express";

export function checkAllUsers(): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            if (req.body.user.type._id === 2 && (!req.query.restaurant || req.body.user.restaurant._id.toString() !== req.query.restaurant)) {
                res.status(401).send({ error: 'Access restricted' }).end();
                return;
            }

            next();
        } catch(err) {
            res.status(401).send({ error: 'Access restricted' }).end();
        }
    }
}