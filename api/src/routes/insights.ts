// Imports 
import { Express, Request, Response } from "express";
let express = require('express');
import * as mongodb from 'mongodb';

// Imports services
import { DataService } from './../services/data';

let router = express.Router();

router.get('/newusersbyhour', (req: Request, res: Response, next: Function) => {
    queryNewUsersByHourWrapper(req, res).then(result => {
        res.json(result);
    });
});

router.get('/newusersbyminute', (req: Request, res: Response, next: Function) => {
    queryNewUsersByMinuteWrapper(req, res).then(result => {
        res.json(result);
    });
});

router.get('/pageviewsgroupedbyuseragent', (req: Request, res: Response, next: Function) => {
    queryPageViews(req, res, 'formattedUserAgent', 10).then(result => {
        res.json(result);
    });
});

router.get('/uniqueusersgroupedbyuseragent', (req: Request, res: Response, next: Function) => {
    queryUniqueUsersWrapper(req, res, 'formattedUserAgent', 10).then(result => {
        res.json(result);
    });
});

router.get('/pageviewsgroupedbyresolution', (req: Request, res: Response, next: Function) => {
    queryPageViews(req, res, 'resolution', 10).then(result => {
        res.json(result);
    });
});

router.get('/uniqueusersgroupedbyresolution', (req: Request, res: Response, next: Function) => {
    queryUniqueUsersWrapper(req, res, 'resolution', 10).then(result => {
        res.json(result);
    });
});

router.get('/pageviewsgroupedbyplatform', (req: Request, res: Response, next: Function) => {
    queryPageViews(req, res, 'platform', 10).then(result => {
        res.json(result);
    });
});

router.get('/uniqueusersgroupedbyplatform', (req: Request, res: Response, next: Function) => {
    queryUniqueUsersWrapper(req, res, 'platform', 10).then(result => {
        res.json(result);
    });
});

router.get('/pageviewsgroupedbylanguage', (req: Request, res: Response, next: Function) => {
    queryPageViews(req, res, 'language', 10).then(result => {
        res.json(result);
    });
});

router.get('/uniqueusersgroupedbylanguage', (req: Request, res: Response, next: Function) => {
    queryUniqueUsersWrapper(req, res, 'language', 10).then(result => {
        res.json(result);
    });
});

router.get('/pageviewsgroupedbypath', (req: Request, res: Response, next: Function) => {
    queryPageViews(req, res, 'path', 10).then(result => {
        res.json(result);
    });
});

router.get('/averagepageloadtimebygroupedpath', (req: Request, res: Response, next: Function) => {
    queryAveragePageLoadTimeWrapper(req, res, 'path', 10).then(result => {
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

function queryPageViews(req: Request, res: Response, property: string, limit: number = null) {
    let dataService = new DataService(mongodb.MongoClient);
    return dataService.queryPageViews(req.query.host, parseInt(req.query.fromDate), parseInt(req.query.toDate), property).then((result: any[]) => {
        result = mapResult(result, false);
        result = limitResult(result, limit);
        return result;
    });
}

function queryNewUsersByMinuteWrapper(req: Request, res: Response) {
    let dataService = new DataService(mongodb.MongoClient);
    return dataService.queryNewUsersByMinute(req.query.host, parseInt(req.query.fromDate), parseInt(req.query.toDate)).then((result: any[]) => {
        result = mapResultForTimestamp(result);
        result = sortResultByTimestamp(result);
        result = limitResult(result, 10);
        return result;
    });
}

function queryNewUsersByHourWrapper(req: Request, res: Response) {
    let dataService = new DataService(mongodb.MongoClient);
    return dataService.queryNewUsersByHour(req.query.host, parseInt(req.query.fromDate), parseInt(req.query.toDate)).then((result: any[]) => {
        result = mapResultForTimestamp(result);
        result = sortResultByTimestamp(result);
        result = limitResult(result, 12);
        return result;
    });
}

function queryUniqueUsersWrapper(req: Request, res: Response, property: string, limit: number = null) {
    let dataService = new DataService(mongodb.MongoClient);
    return dataService.queryUniqueUsers(req.query.host, parseInt(req.query.fromDate), parseInt(req.query.toDate), property).then((result: any[]) => {
        result = mapResult(result, false);
        result = limitResult(result, limit);
        return result;
    });
}

function queryAveragePageLoadTimeWrapper(req: Request, res: Response, property: string, limit: number = null) {
    let dataService = new DataService(mongodb.MongoClient);
    return dataService.queryAveragePageLoadTime(req.query.host, parseInt(req.query.fromDate), parseInt(req.query.toDate), property).then((result: any[]) => {
        result = mapResult(result, true);
        result = limitResult(result, limit);
        return result;
    });
}

function mapResult(result: any[], isAverage: Boolean) {
    return result.map(x => {
        return {
            key: x._id.key,
            value: isAverage ? Math.round(x.average) : x.count
        }
    });
}

function mapResultForTimestamp(result: any[]) {
    return result.map(x => {
        return {
            key: toDoubleDigitsString(x._id.hour) + ':' + toDoubleDigitsString(x._id.minute) + ' ' + toDoubleDigitsString(x._id.day) + '-' + toDoubleDigitsString(x._id.month) + '-' + x._id.year,
            value: x.count
        }
    });
}

function sortResultByTimestamp(result: any[]) {
    return result.sort((a, b) => {
        return new Date(a.key).getTime() - new Date(b.key).getTime();
    });
}

function limitResult(result: any[], limit: number) {
    if (limit != null && result.length > limit) {
        result = result.slice(0, limit);
    }

    return result;
}
function toDoubleDigitsString(n: number) {
    if (n < 10) {
        return '0' + n;
    }

    return n;
}

export = router;
