// Imports
import express = require("express");
import bodyParser = require("body-parser");
import * as https from 'https';
import * as fs from 'fs';
import expressWinston = require('express-winston');


// Import Routes
import * as dataRouter from './routes/data';
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
        app.use("/api/data", dataRouter);
        app.use("/api/insights", insightsRouter);
    }

    public run() {
        this.app.listen(this.port);
    }
}

import * as mongodb from 'mongodb';
import { data } from './simpleData';
let useragent = require('useragent');

function identifyBrowser(userAgent) {
    let agent = useragent.parse(userAgent);
    return agent.toAgent();
}

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
        collection = database.collection('snapshots');
        return collection.remove({});
    }).then((result: any) => {
        data.forEach(x => {
            x['formattedUserAgent'] = identifyBrowser(x.userAgent);
            x['pageLoadTime'] = Math.floor(Math.random() * 1500);
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




