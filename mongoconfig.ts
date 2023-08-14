import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigEnum } from 'src/enum/config.enum';

function getEnv(env: string): Record<string, any> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
  return {};
}
function buildMongoConnectionOptions() {
  const defaultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV || 'development'}`);
  const config = { ...defaultConfig, ...envConfig };

  const host = config[ConfigEnum.MONGO_DB_HOST];
  const port = config[ConfigEnum.MONGO_DB_PORT];
  const username = config[ConfigEnum.MONGO_DB_USERNAME];
  const password = config[ConfigEnum.MONGO_DB_PASSWORD];
  const database = config[ConfigEnum.MONGO_DB_DATABASE];
  const uri = username
    ? `mongodb://${username}:${password}@${host}:${port}/${database}`
    : `mongodb://${host}:${port}/${database}`;
  return {
    // uri,
    uri: 'mongodb://localhost:27018/nest_seed',
    retryAttempts: Infinity,
    retryDelay: 5000,
  } as MongooseModuleOptions;
}

export const mongoConnectionParams = buildMongoConnectionOptions();
