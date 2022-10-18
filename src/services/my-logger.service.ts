import { Injectable, LoggerService } from '@nestjs/common';

import * as fs from 'fs';
import * as winston from 'winston';
import * as dailyRotateFile from 'winston-daily-rotate-file';

import { configService } from './config.service';

@Injectable()
export class MyLoggerService implements LoggerService {
    private logger: winston.Logger;

    constructor() {
        const logDirectory = configService.getLogDirectory();
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory);
        }
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            ),
            transports: [
                new winston.transports.Console(),
                new dailyRotateFile({
                    filename: 'server%DATE%.log',
                    dirname: logDirectory,
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '20m'
                })
            ]
        });
    }

    log(message: string) {
        this.logger.info(message);
    }

    error(message: string) {
        this.logger.info(message);
    }

    warn(message: string) {
        this.logger.info(message);
    }

    debug(message: string) {
        this.logger.info(message);
    }

    verbose(message: string) {
        this.logger.info(message);
    }

    getHttpLogger(req: any, res: any, next: () => void) {
        const user = req.user;
        const email = user ? user.email : 'not auth';

        const logData: string[] = [];

        logData.push(email);
        logData.push(req.method);
        logData.push(req.originalUrl);

        req['_startTime'] = Date.now();

        const originSend = res.send;
        let resBody = '';

        res.send = (data) => {
            try {
                if (data instanceof Buffer) {
                    resBody = `Buffer length: ${data.length}`
                } else if (data.constructor != String) {
                    resBody = JSON.stringify(data);
                } else {
                    resBody = data.toString();
                }

                // 只展示Buffer长度
                if (resBody.includes('"type":"Buffer"')) {
                    resBody = resBody.replace(
                        /{"type":"Buffer","data":\[(.*?)\]}/g,
                        (match, substring) => {
                            return `"Buffer length: ${substring.split(',').length}"`;
                        }
                    );
                }
            } catch (e) {
                this.error(e.message);
            }
            return originSend.call(res, data);
        }

        res.once('finish', () => {
            logData.push(res.statusCode);
            logData.push(`${(Date.now() - req['_startTime'])} ms`);
            logData.push(`Request=${JSON.stringify(req.body)}`)
            logData.push(`Response=${resBody}`)

            req['_startTime'] = undefined;
            this.log(logData.join(' - '));
        })
        next();
    }
}

const myLogger = new MyLoggerService();
export { myLogger };
