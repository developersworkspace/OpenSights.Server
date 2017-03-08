// Imports 
import { Express, Request, Response } from "express";
let express = require('express');
import * as mongodb from 'mongodb';

// Imports services
import { DataService } from './../services/data';

let router = express.Router();

router.get('/pageviewsgroupedbyuseragent', (req: Request, res: Response, next: Function) => {
    statsQueryWrapper(req, res, 'formattedUserAgent', 10).then(result => {
        res.json(result);
    });
});

router.get('/uniqueusersgroupedbyuseragent', (req: Request, res: Response, next: Function) => {
    statsQueryUniqueUsersWrapper(req, res, 'formattedUserAgent', 10).then(result => {
        res.json(result);
    });
});

router.get('/pageviewsgroupedbyresolution', (req: Request, res: Response, next: Function) => {
    statsQueryWrapper(req, res, 'resolution', 10).then(result => {
        res.json(result);
    });
});

router.get('/uniqueusersgroupedbyresolution', (req: Request, res: Response, next: Function) => {
    statsQueryUniqueUsersWrapper(req, res, 'resolution', 10).then(result => {
        res.json(result);
    });
});

router.get('/pageviewsgroupedbyplatform', (req: Request, res: Response, next: Function) => {
    statsQueryWrapper(req, res, 'platform', 10).then(result => {
        res.json(result);
    });
});

router.get('/uniqueusersgroupedbyplatform', (req: Request, res: Response, next: Function) => {
    statsQueryUniqueUsersWrapper(req, res, 'platform', 10).then(result => {
        res.json(result);
    });
});

router.get('/pageviewsgroupedbylanguage', (req: Request, res: Response, next: Function) => {
    statsQueryWrapper(req, res, 'language', 10).then(result => {
        res.json(result);
    });
});

router.get('/uniqueusersgroupedbylanguage', (req: Request, res: Response, next: Function) => {
    statsQueryUniqueUsersWrapper(req, res, 'language', 10).then(result => {
        res.json(result);
    });
});

router.get('/pageviewsgroupedbypath', (req: Request, res: Response, next: Function) => {
    statsQueryWrapper(req, res, 'path', 5).then(result => {
        res.json(result);
    });
});

router.get('/averagepageloadtimebygroupedpath', (req: Request, res: Response, next: Function) => {
    statsQueryWithAverageWrapper(req, res, 'path', 'pageLoadTime', 5).then(result => {
        res.json(result);
    });
});

router.get('/hosts', (req: Request, res: Response, next: Function) => {

    let dataService = new DataService(mongodb.MongoClient);

    dataService.listHosts().then((result: any[]) => {
        res.json(result);
    });
});

router.get('/stats', (req: Request, res: Response, next: Function) => {

    let dataService = new DataService(mongodb.MongoClient);

    dataService.getDatabaseStats().then((result: any) => {
        res.json(result);
    });
});

function statsQueryWrapper(req: Request, res: Response, property: string, limit: number = null) {
    let dataService = new DataService(mongodb.MongoClient);
    return dataService.statsQuery(getMatchObject(req, false), getGroupByObject(property)).then((result: any[]) => {
            result = mapResult(result, false);
            result = limitResult(result, limit);
            return result;
        });
}

function statsQueryUniqueUsersWrapper(req: Request, res: Response, property: string, limit: number = null) {
    let dataService = new DataService(mongodb.MongoClient);
    return dataService.statsQuery(getMatchObject(req, true), getGroupByObject(property)).then((result: any[]) => {
            result = mapResult(result, false);
            result = limitResult(result, limit);
            return result;
        });
}

function statsQueryWithAverageWrapper(req: Request, res: Response, property: string, averageProperty: string, limit: number = null) {
    let dataService = new DataService(mongodb.MongoClient);
    return dataService.statsQueryWithAverage(getMatchObject(req, false), getGroupByObject(property), averageProperty).then((result: any[]) => {
            result = mapResult(result, true);
            result = limitResult(result, limit);
            return result;
        });
}

function mapResult(result: any[], isAverage: Boolean) {
    return result.map(x => {
        return {
            key: x._id.key,
            value: isAverage? Math.round(x.average) : x.count
        }
    });
}

function limitResult(result: any[], limit: number) {
    if (limit != null && result.length > limit) {
        result = result.slice(0, limit);
    }

    return result;
}

function getMatchObject(req: Request, isUniqueUsers: Boolean) {
    if (isUniqueUsers) {
        return {
            "host": req.query.host,
            isNew: true,
            "timestamp": {
                $gt: parseInt(req.query.fromDate),
                $lt: parseInt(req.query.toDate)
            }
        };
    } else {
        return {
            "host": req.query.host,
            "timestamp": {
                $gt: parseInt(req.query.fromDate),
                $lt: parseInt(req.query.toDate)
            }
        };
    }
}

function getGroupByObject(property: string) {
    return {
        "key": "$" + property
    };
}


export = router;
