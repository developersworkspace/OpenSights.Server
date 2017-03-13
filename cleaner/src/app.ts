// Imports
import * as schedule from 'node-schedule';
import * as mongodb from 'mongodb';

// Imports logger
import { logger } from './logger';

// Imports configuration
import { config } from './config';


class Cleaner {



    constructor(private mongoClient: mongodb.MongoClient) {

    }


    clean() {

        let cleanTimestamp = new Date();
        cleanTimestamp.setDate(cleanTimestamp.getDate() - 2);

        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            var collection = db.collection('pageviews');
            return collection.remove({
                timestamp: { $lt: this.getUTCMiliSeconds(cleanTimestamp) }
            });
        }).then((result: any) => {
            return true;
        });
    }

    private getUTCMiliSeconds(dateTime) {
        return (dateTime.getTime() + dateTime.getTimezoneOffset() * 60 * 1000);
    }

}

let cleaner = new Cleaner(mongodb.MongoClient);

logger.info('Scheduling job');

var j = schedule.scheduleJob('*/1 * * * *', function () {
    logger.info('Clean started');
    cleaner.clean().then(() => {
        logger.info('Clean finished');
    }).catch((err: Error) => {
        logger.error(err.message);
    })
});

logger.info('Scheduled job');






