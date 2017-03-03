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
            res.json(result);
        });
});

export = router;
