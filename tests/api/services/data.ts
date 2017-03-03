// Imports
import 'mocha';
import { expect } from 'chai';
import { Express, Request, Response } from "express";

// Imports services
import { DataService } from './../../../api/src/services/data';

// Imports mocks
import * as mongodb from 'mongo-mock';


describe('DataService', () => {

    let dataService: DataService = null;

    beforeEach(() => {
        let mongoClient = mongodb.MongoClient;
        dataService = new DataService(mongoClient);

        return Promise.all([
            dataService.save("::ffff:197.88.146.128", {
                "uuid": "3ac6f090-5dc1-5c5e-ae7d-53c85a4f4890",
                "path": "/F:/Development/GitHub/OpenSights.JS/src/index.html",
                "host": "",
                "protocol": "file:",
                "appCodeName": "Mozilla",
                "appName": "Netscape",
                "appVersion": "5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
                "cookieEnabled": true,
                "hardwareConcurrency": 4,
                "language": "en-US",
                "platform": "Win32",
                "product": "Gecko",
                "productSub": "20030107",
                "userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
                "vendor": "Google Inc.",
                "vendorSub": "",
                "cookie": ""
            })
        ]);
    });

    describe('save', () => {
        it('should return true', () => {
            return dataService.save("::ffff:197.88.146.128", {
                "uuid": "3ac6f090-5dc1-5c5e-ae7d-53c85a4f4890",
                "path": "/F:/Development/GitHub/OpenSights.JS/src/index.html",
                "host": "",
                "protocol": "file:",
                "appCodeName": "Mozilla",
                "appName": "Netscape",
                "appVersion": "5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
                "cookieEnabled": true,
                "hardwareConcurrency": 4,
                "language": "en-US",
                "platform": "Win32",
                "product": "Gecko",
                "productSub": "20030107",
                "userAgent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
                "vendor": "Google Inc.",
                "vendorSub": "",
                "cookie": ""
            }).then((result: Boolean) => {
                expect(result).to.be.true;
            });
        });
    });
});