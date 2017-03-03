// Imports
import express = require("express");
import bodyParser = require("body-parser");
import * as https from 'https';
import * as fs from 'fs';
import expressWinston = require('express-winston');

// Import Routes
import * as dataRouter from './routes/data';

// Import middleware
import * as cors from 'cors';

// Imports logger
import { logger } from './logger';

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
    }

    public run() {
         this.app.listen(this.port);
    }
}

let port = 3000;
let api = new WebApi(express(), port);
api.run();
logger.info(`Listening on ${port}`);