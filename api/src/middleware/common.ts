// Imports
import { Express, Request, Response } from "express";
import * as express from 'express';

// Adds headers to enable CORS
export function CORS(req: Request, res: Response, next: Function) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    next();
}