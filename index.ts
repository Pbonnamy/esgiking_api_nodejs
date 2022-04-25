import {config} from "dotenv";
config();
import express from 'express';
import {Request, Response} from "express";

const app = express();

app.get('/', function (req: Request, res: Response){
    res.send("Hello world");
})

app.listen(process.env.PORT, function() {
    console.log("Server started & listening on port " + process.env.PORT);
})