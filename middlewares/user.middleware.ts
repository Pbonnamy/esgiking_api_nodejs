import {Request, RequestHandler} from "express";
import {UserService} from "../services";

export function checkUser(): RequestHandler {
    return async function(req: Request, res, next) {
        try {
            if (req.body.user.type._id === 2) {
                const target = await UserService.getInstance().getOneById(req.params.id);
                if(target?.restaurant?._id.toString() !== req.body.user.restaurant._id.toString()) {
                    res.status(401).send({error: 'Access restricted'}).end();
                    return;
                }
            }else if ((req.body.user.type._id === 3 || req.body.user.type._id === 4 || req.body.user.type._id === 5) && req.params.id !== req.body.user.id.toString()) {
                res.status(401).send({ error: 'Access restricted' }).end();
                return;
            }

            next();
        } catch(err) {
            res.status(401).send({ error: 'Access restricted' }).end();
        }
    }
}