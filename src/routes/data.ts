// Imports 
import { Express, Request, Response } from "express";
import * as mongodb from 'mongodb';

let express = require('express');
let router = express.Router();

router.post('/save', (req: Request, res: Response, next: Function) => {
    saveToDatastore(req.body);
    res.send('OK');
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

export = router;
