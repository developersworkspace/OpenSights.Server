// Imports 
import { Express, Request, Response } from "express";
let express = require('express');
import * as mongodb from 'mongodb';

// Imports services
import { DataService } from './../services/data';

let router = express.Router();

router.post('/save', (req: Request, res: Response, next: Function) => {
    let dataService = new DataService(mongodb.MongoClient);

    let ipAddress = req.headers['x-real-ip'] || req.connection.remoteAddress;

    dataService.save(ipAddress, req.body).then((result: Boolean) => {
        res.send('OK');
    });    
});


router.post('/get', (req: Request, res: Response, next: Function) => {
    let dataService = new DataService(mongodb.MongoClient);

    dataService.query(req.body).then((result: any[]) => {
        res.json(result);
    });
});

export = router;
