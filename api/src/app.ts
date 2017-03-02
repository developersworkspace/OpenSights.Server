// Imports
import express = require("express");
import bodyParser = require("body-parser");
import * as https from 'https';
import * as fs from 'fs';

// Import Routes
import * as dataRouter from './routes/data';

// Import middleware
import { CORS } from './middleware/common';

export class WebApi {

    constructor(private app: express.Express, private httpsPort: number) {
        this.configureMiddleware(app);
        this.configureRoutes(app);
    }

    private configureMiddleware(app: express.Express) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(CORS);
    }

    private configureRoutes(app: express.Express) {
        app.use("/api/data", dataRouter);
    }

    public run() {
        https.createServer({
            key: fs.readFileSync(__dirname + '/domain.key'),
            cert: fs.readFileSync(__dirname + '/chained.pem')
        }, this.app).listen(this.httpsPort);
    }
}

let httpsPort = 3000;
let api = new WebApi(express(), httpsPort);
api.run();
console.info(`Listening on ${httpsPort}`);