// Imports 
import { Express, Request, Response } from "express";
let express = require('express');

// Imports services
import { DataService } from './../services/data';

let router = express.Router();

router.post('/save', (req: Request, res: Response, next: Function) => {

    let dataService = new DataService();

    dataService.save(req, req.body).then((result: Boolean) => {
        res.send('OK');
    });    
});

/*
    {
        "userAgent": "$userAgent"
    }
*/
router.post('/get', (req: Request, res: Response, next: Function) => {

    let dataService = new DataService();

    dataService.query(req.body).then((result: any[]) => {
        res.json(result);
    });
});

export = router;
