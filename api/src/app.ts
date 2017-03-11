// Imports
import express = require("express");
import bodyParser = require("body-parser");
import * as https from 'https';
import * as fs from 'fs';
import expressWinston = require('express-winston');


// Import Routes
import * as pageViewRouter from './routes/pageView';
import * as insightsRouter from './routes/insights';

// Import middleware
import * as cors from 'cors';

// Imports logger
import { logger } from './logger';

// Imports configuration
import { config } from './config';

export class WebApi {

    constructor(private app: express.Express, private port: number) {
        this.configureMiddleware(app);
        this.configureRoutes(app);
    }

    private configureMiddleware(app: express.Express) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cors());
        app.use(expressWinston.logger({
            winstonInstance: logger,
            meta: false,
            msg: 'HTTP Request: {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}'
        }));
    }

    private configureRoutes(app: express.Express) {
        app.use("/api/pageview", pageViewRouter);
        app.use("/api/insights", insightsRouter);
    }

    public run() {
        this.app.listen(this.port);
    }
}

import * as mongodb from 'mongodb';
import { data } from './sampleData';

if (config.production) {
    let port = 3000;
    let api = new WebApi(express(), port);
    api.run();
    logger.info(`Listening on ${port}`);
} else {


    let collection: any;
    let database: any;
    mongodb.MongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
        database = db;
        collection = database.collection('pageviews');
        return collection.remove({});
    }).then((result: any) => {
        data.forEach(x => {

            x['timestamp'] = x['timestamp'] * 1000;
            let date = new Date(1970, 0, 1);
            date.setMilliseconds(x['timestamp']);
            x['day'] = date.getDate();
            x['month'] = date.getMonth() + 1;
            x['year'] =date.getFullYear();
            x['hour'] = date.getHours();
            x['minute'] = date.getMinutes();
            x['second'] = date.getSeconds();

            return x;
        });
        return collection.insertMany(data);
    }).then((result: any) => {
        let port = 3000;
        let api = new WebApi(express(), port);
        api.run();
        logger.info(`Listening on ${port}`);
    });
}




