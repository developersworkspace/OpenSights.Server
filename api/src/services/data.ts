// Imports
import { Express, Request, Response } from "express";
import * as mongodb from 'mongodb';
let useragent = require('useragent');

// Imports configuration
import { config } from './../config';

export class DataService {

    constructor(private mongoClient: mongodb.MongoClient) {

    }

    public save(ipAddress: string, obj): Promise<Boolean> {
        obj['timestamp'] = this.getUTCSeconds();
        obj['ipAddress'] = ipAddress;
        obj['formattedUserAgent'] = this.identifyBrowser(obj['userAgent']);

        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            var collection = db.collection('snapshots');
            return collection.insertOne(obj).then((result: any) => {
                db.close();
                return result;
            });
        }).then((result: any) => {
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
            ]).toArray().then((result: any[]) => {
                db.close();
                return result;
            });
        });
    }

    public listHosts() {
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            var collection = db.collection('snapshots');
            return collection.aggregate([
                { $match: {} }
                , {
                    "$group": {
                        "_id": {
                            "host": "$host"
                        }
                    }
                }
            ]).toArray().then((result: any[]) => {
                db.close();
                return result.map(x => x._id.host).filter(x => x != null && x != '');
            });
        });
    }

    public statsQuery(match: any, query: any): Promise<any[]> {
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            var collection = db.collection('snapshots');

            let p: any[] = [
                { $match: match }
                , {
                    $group:
                    {
                        _id: query,
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ];

            return collection.aggregate(p).toArray().then((result: any[]) => {
                db.close();
                return result;
            });
        });
    }

    public statsQueryWithAverage(match: any, query: any, property: string): Promise<any[]> {
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            var collection = db.collection('snapshots');

            let p: any[] = [
                { $match: match }
                , {
                    $group:
                    {
                        _id: query,
                        count: { $sum: 1 },
                        average: { $avg: '$' + property }
                    }
                },
                { $sort: { average: -1 } }
            ];

            return collection.aggregate(p).toArray().then((result: any[]) => {
                db.close();
                return result;
            });
        });
    }

    private getUTCSeconds() {
        var currentTime = new Date()
        var UTCseconds = (currentTime.getTime() + currentTime.getTimezoneOffset() * 60 * 1000) / 1000;

        return UTCseconds;
    }

    private identifyBrowser(userAgent) {
        let agent = useragent.parse(userAgent);
        return agent.toAgent();
    }
}