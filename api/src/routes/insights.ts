// Imports 
import { Express, Request, Response } from "express";
let express = require('express');
import * as mongodb from 'mongodb';

// Imports services
import { DataService } from './../services/data';

let router = express.Router();

router.get('/groupbyuseragent', (req: Request, res: Response, next: Function) => {

    let dataService = new DataService(mongodb.MongoClient);

    dataService.statsQuery({
        "host": req.query.host
    },
        {
            "userAgent": "$userAgent"
        }).then((result: any[]) => {
            res.json(result.map(x => {
                return {
                    key: x._id.userAgent,
                    value: x.count
                }
            }));
        });
});

router.get('/groupbyresolution', (req: Request, res: Response, next: Function) => {

    let dataService = new DataService(mongodb.MongoClient);

    dataService.statsQuery({
        "host": req.query.host
    },
        {
            "resolution": "$resolution"
        }).then((result: any[]) => {
            res.json(result.map(x => {
                return {
                    key: x._id.resolution,
                    value: x.count
                }
            }));
        });
});

router.get('/hosts', (req: Request, res: Response, next: Function) => {

    let dataService = new DataService(mongodb.MongoClient);

    dataService.listHosts().then((result: any[]) => {
        res.json(result);
    });
});

export = router;
