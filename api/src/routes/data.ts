// Imports 
import { Express, Request, Response } from "express";
import * as mongodb from 'mongodb';

let express = require('express');
let router = express.Router();

router.post('/save', (req: Request, res: Response, next: Function) => {
    saveToDatastore(req.body);
    res.send('OK');
});

/*
    {
        "userAgent": "$userAgent"
    }
*/
router.post('/get', (req: Request, res: Response, next: Function) => {
    select(res, req.body);
});

function saveToDatastore(obj) {
    let mongoClient = new mongodb.MongoClient();
    mongoClient.connect('mongodb://mongo:27017/opensights', (err: Error, db: mongodb.Db) => {
        if (err) {
            console.log(err);
        } else {
            var collection = db.collection('snapshots');
            collection.insertOne(obj, (result) => {
                console.log('Successfully logged entry');
            });
        }
    });
}


function select(res: Response, query: any) {
    let mongoClient = new mongodb.MongoClient();
    mongoClient.connect('mongodb://mongo:27017/opensights', (err: Error, db: mongodb.Db) => {
        if (err) {
            console.log(err);
        } else {
            var collection = db.collection('snapshots');
            collection.aggregate([
                { $match: {} }
                , {
                    $group:
                    { _id: query, list: { $push: '$$ROOT' } }
                }
            ]).toArray((err: Error, results: any) => {
                res.json(results);
                db.close();
            });
        }
    });
}

export = router;
