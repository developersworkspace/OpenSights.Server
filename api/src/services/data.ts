// Imports
import { Express, Request, Response } from "express";
import * as mongodb from 'mongodb';

export class DataService {



    save(req: Request, obj): Promise<Boolean> {
        obj['timestamp'] = this.getUTCSeconds();
        obj['ipAddress'] = req.ip;
        let mongoClient = new mongodb.MongoClient();
        return mongoClient.connect('mongodb://mongo:27017/opensights').then((db: mongodb.Db) => {
            var collection = db.collection('snapshots');
            return collection.insertOne(obj);
        }).then((result) => {
            return true;
        });
    }

    query(query: any): Promise<any[]> {
        let mongoClient = new mongodb.MongoClient();
        return mongoClient.connect('mongodb://mongo:27017/opensights').then((db: mongodb.Db) => {
            var collection = db.collection('snapshots');
            return collection.aggregate([
                { $match: {} }
                , {
                    $group:
                    {
                        _id: query,
                        list: {
                            $push: '$$ROOT'
                        },
                        count: { $sum: 1 }
                    }
                }
            ]).toArray();
        });
    }


    private getUTCSeconds() {
        var currentTime = new Date()
        var UTCseconds = (currentTime.getTime() + currentTime.getTimezoneOffset() * 60 * 1000) / 1000;

        return UTCseconds;
    }
}