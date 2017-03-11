// Imports
import { Express, Request, Response } from "express";
import * as mongodb from 'mongodb';
let useragent = require('useragent');

// Imports configuration
import { config } from './../config';

export class PageViewService {

    constructor(private mongoClient: mongodb.MongoClient) {

    }

    public savePageView(ipAddress: string, obj: Object): Promise<Boolean> {
        obj['timestamp'] = this.getUTCMiliSeconds(new Date());
        obj['ipAddress'] = ipAddress;
        obj['formattedUserAgent'] = this.identifyBrowser(obj['userAgent']);

        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            var collection = db.collection('pageviews');
            return collection.insertOne(obj).then((result: any) => {
                db.close();
                return result;
            });
        }).then((result: any) => {
            return true;
        });
    }

    public getDatabaseStats(): Promise<any> {
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            return db.stats();
        }).then((result: any) => {
            return result;
        });
    }

    public queryPageViews(host: string, fromDate: number, toDate: number, property: string) {
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            var collection = db.collection('pageviews');

            let p: any[] = [
                {
                    $match: {
                        "host": host,
                        "timestamp": {
                            $gt: fromDate,
                            $lt: toDate
                        }
                    }
                },
                {
                    $group:
                    {
                        _id: {
                            "key": "$" + property
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        key: '$_id.key',
                        count: '$count'
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                }
            ];

            return collection.aggregate(p).toArray().then((result: any[]) => {
                db.close();
                return result;
            });
        });
    }

    public queryNewUsers(host: string, fromDate: number, toDate: number, property: string) {
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            var collection = db.collection('pageviews');

            let p: any[] = [
                {
                    $match: {
                        "host": host,
                        isNew: true,
                        "timestamp": {
                            $gt: fromDate,
                            $lt: toDate
                        }
                    }
                },
                {
                    $group:
                    {
                        _id: {
                            "key": "$" + property
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        key: '$_id.key',
                        count: '$count'
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                }
            ];

            return collection.aggregate(p).toArray().then((result: any[]) => {
                db.close();
                return result;
            });
        });
    }

    public queryNewUsersByMinute(host: string, fromDate: number, toDate: number) {
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            var collection = db.collection('pageviews');

            let p: any[] = [
                {
                    $match: {
                        "host": host,
                        isNew: true,
                        "timestamp": {
                            $gt: fromDate,
                            $lt: toDate
                        }
                    }
                },
                {
                    $group:
                    {
                        _id: {
                            "hour": '$hour',
                            "minute": '$minute',
                            "day": '$day',
                            "month": '$month',
                            "year": '$year'
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        key: '$_id.key',
                        count: '$count'
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                }
            ];

            return collection.aggregate(p).toArray().then((result: any[]) => {
                db.close();
                return result;
            });
        });
    }

    public queryNewUsersByHour(host: string, fromDate: number, toDate: number) {
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            var collection = db.collection('pageviews');

            let p: any[] = [
                {
                    $match: {
                        "host": host,
                        isNew: true,
                        "timestamp": {
                            $gt: fromDate,
                            $lt: toDate
                        }
                    }
                },
                {
                    $group:
                    {
                        _id: {
                            "hour": '$hour',
                            "minute": { $literal: 0 },
                            "day": '$day',
                            "month": '$month',
                            "year": '$year'
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        key: '$_id.key',
                        count: '$count'
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                }
            ];

            return collection.aggregate(p).toArray().then((result: any[]) => {
                db.close();
                return result;
            });
        });
    }

    public queryUniqueUsers(host: string, fromDate: number, toDate: number, property: string) {
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            var collection = db.collection('pageviews');

            let p: any[] = [
                {
                    $match: {
                        "host": host,
                        "timestamp": {
                            $gt: fromDate,
                            $lt: toDate
                        }
                    }
                },
                {
                    $group:
                    {
                        _id: {
                            "key": "$" + property
                        },
                        list: {
                            $push: '$uuid'
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        key: '$_id.key',
                        list: '$list',
                        count: '$count'
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                }
            ];

            return collection.aggregate(p).toArray().then((result: any[]) => {
                db.close();
                result.forEach(x => {
                    x.count = this.distinct(x.list).length;
                });

                result = result.sort((a, b) => {
                    return b.count - a.count
                });

                return result;
            });
        });
    }

    public queryAveragePageLoadTime(host: string, fromDate: number, toDate: number, property: string) {
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            var collection = db.collection('pageviews');

            let p: any[] = [
                {
                    $match:
                    {
                        "host": host,
                        "timestamp": {
                            $gt: fromDate,
                            $lt: toDate
                        }
                    }
                },
                {
                    $group:
                    {
                        _id: {
                            "key": "$" + property
                        },
                        count: { $sum: 1 },
                        average: { $avg: '$pageLoadTime' }
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

    public rawData(): Promise<any[]> {
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            var collection = db.collection('pageviews');

            return collection.find().toArray().then((result: any[]) => {
                db.close();
                return result;
            });
        });
    }

    public listHosts() {
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            var collection = db.collection('pageviews');
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

    private identifyBrowser(userAgent) {
        let agent = useragent.parse(userAgent);
        return agent.toAgent();
    }

    private getUTCMiliSeconds(dateTime) {
        return (dateTime.getTime() + dateTime.getTimezoneOffset() * 60 * 1000);
    }

    private distinct(arr: any[], key: string = null) {

        if (key == null) {
            var processed = [];
            for (var i = arr.length - 1; i >= 0; i--) {
                if (processed.indexOf(arr[i]) < 0) {
                    processed.push(arr[i]);
                } else {
                    arr.splice(i, 1);
                }
            }
        } else {
            var processed = [];
            for (var i = arr.length - 1; i >= 0; i--) {
                if (processed.indexOf(arr[i][key]) < 0) {
                    processed.push(arr[i][key]);
                } else {
                    arr.splice(i, 1);
                }
            }
        }

        return arr;
    }
}