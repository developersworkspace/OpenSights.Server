// Imports 
import { Express, Request, Response } from "express";
let express = require('express');
import * as mongodb from 'mongodb';

// Imports services
import { DataService } from './../services/data';

let router = express.Router();

router.get('/groupbyuseragent', (req: Request, res: Response, next: Function) => {
    statsQueryWrapper(req, res, 'formattedUserAgent', 10).then(result => {
        res.json(result);
    });
});

router.get('/groupbyresolution', (req: Request, res: Response, next: Function) => {
    statsQueryWrapper(req, res, 'resolution', 10).then(result => {
        res.json(result);
    });
});

router.get('/groupbyplatform', (req: Request, res: Response, next: Function) => {
    statsQueryWrapper(req, res, 'platform', 10).then(result => {
        res.json(result);
    });
});

router.get('/groupbylanguage', (req: Request, res: Response, next: Function) => {
    statsQueryWrapper(req, res, 'language', 10).then(result => {
        res.json(result);
    });
});

router.get('/groupbypath', (req: Request, res: Response, next: Function) => {
    statsQueryWrapper(req, res, 'path', 5).then(result => {
        res.json(result);
    });
});

router.get('/averagepageloadtimebypath', (req: Request, res: Response, next: Function) => {
    statsQueryWithAverageByDayWrapper(req, res, 'path', 'pageLoadTime', 5).then(result => {
        result = result.map(x => {
            return {
                key: x.key,
                value: Math.round(x.value)
            };
        });
        res.json(result);
    });
});

router.get('/hosts', (req: Request, res: Response, next: Function) => {

    let dataService = new DataService(mongodb.MongoClient);

    dataService.listHosts().then((result: any[]) => {
        res.json(result);
    });
});

function statsQueryWrapper(req: Request, res: Response, property: string, limit: number = null) {
    let dataService = new DataService(mongodb.MongoClient);
    return dataService.statsQuery({
        "host": req.query.host,
        "timestamp": {
            $gt: parseInt(req.query.fromDate),
            $lt: parseInt(req.query.toDate)
        }
    },
        {
            "key": "$" + property
        }).then((result: any[]) => {
            result = result.map(x => {
                return {
                    key: x._id.key,
                    value: x.count
                }
            });

            if (limit != null && result.length > limit) {
                result = result.slice(0, limit);
            }
            return result;
        });
}

function statsQueryWithAverageByDayWrapper(req: Request, res: Response, property: string, averageProperty: string, limit: number = null) {
    let dataService = new DataService(mongodb.MongoClient);
    return dataService.statsQueryWithAverage({
        "host": req.query.host,
        "timestamp": {
            $gt: parseInt(req.query.fromDate),
            $lt: parseInt(req.query.toDate)
        }
    },
        {
            "key": "$" + property
        }, averageProperty).then((result: any[]) => {
            result = result.map(x => {
                return {
                    key: x._id.key,
                    value: x.average
                }
            });

            if (limit != null && result.length > limit) {
                result = result.slice(0, limit);
            }
            return result;
        });
}


export = router;
