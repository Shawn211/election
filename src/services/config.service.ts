import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from'@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
type EnvConfig = Record<string, string>;

@Injectable()
export class ConfigService {
    private readonly envConfig: EnvConfig;

    constructor() {
        const filePath = `${process.env.NODE_ENV || 'development'}.env`;
        const envFile = path.resolve(__dirname, '../../config', filePath);
        this.envConfig = dotenv.parse(fs.readFileSync(envFile));
    }

    private getValue(key: string, throwOnMissing = true): string {
        const value = this.envConfig[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }

        return value;
    }

    public getPort() {
        return this.getValue('PORT', true);
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',

            host: this.getValue('POSTGRES_HOST'),
            port: parseInt(this.getValue('POSTGRES_PORT')),
            username: this.getValue('POSTGRES_USER'),
            password: this.getValue('POSTGRES_PASSWORD'),
            database: this.getValue('POSTGRES_DATABASE'),

            entities: [ __dirname + '../**/*.entity{.ts,.js}' ],

            synchronize: true
        };
    }
}
