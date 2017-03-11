// Imports 
import { Express, Request, Response } from "express";
let express = require('express');
import * as mongodb from 'mongodb';

// Imports services
import { PageViewService } from './../services/pageView';

let router = express.Router();

router.post('/save', (req: Request, res: Response, next: Function) => {
    let pageViewService = new PageViewService(mongodb.MongoClient);

    let ipAddress = req.headers['x-real-ip'] || req.connection.remoteAddress;

    pageViewService.savePageView(ipAddress, req.body).then((result: Boolean) => {
        res.send('OK');
    });    
});

router.get('/rawdata', (req: Request, res: Response, next: Function) => {
    let pageViewService = new PageViewService(mongodb.MongoClient);

    pageViewService.rawData().then((result: any[]) => {
        res.json(result);
    });
});

export = router;
