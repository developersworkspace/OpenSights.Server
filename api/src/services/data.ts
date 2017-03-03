// Imports
import { Express, Request, Response } from "express";
import * as mongodb from 'mongodb';

// Imports configuration
import { config } from './../config';

export class DataService {

    constructor(private mongoClient: mongodb.MongoClient) {

    }

    public save(ipAddress: string, obj): Promise<Boolean> {
        obj['timestamp'] = this.getUTCSeconds();
        obj['ipAddress'] = ipAddress;

        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            var collection = db.collection('snapshots');
            return collection.insertOne(obj);
        }).then((result) => {
            return true;
        });
    }

    public query(query: any): Promise<any[]> {
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
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