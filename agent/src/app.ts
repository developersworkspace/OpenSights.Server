// Imports
import * as fs from 'fs';
import * as os from 'os';
import * as schedule from 'node-schedule';

// Imports logger
import { logger } from './logger';

// Imports configuration
import { config } from './config';


class Agent {

    private osType: string;

    constructor() {
        this.osType = os.type();
    }

    getFreeMemory() {
        if (this.isWindows()) {
            return os.freemem();
        } if (this.isLinux()) {
            return -1;
        } else {
            return null;
        }
    }
    
    bytesToHumanReadableString(size: number) {
        let i = Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }


    private isLinux() {
        if (this.osType == 'Linux') {
            return true;
        }
        return false;
    }

    private isWindows() {
        if (this.osType == 'Windows_NT') {
            return true;
        }
        return false;
    }
}

let agent = new Agent();
console.log('Running...');
var j = schedule.scheduleJob('*/1 * * * *', function () {
    console.log(agent.getFreeMemory());
});






