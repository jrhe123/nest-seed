import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import * as _ from 'lodash';

// common config
const filePath = join(__dirname, '../config', 'config.yml');
// env config
const envPath = join(
  __dirname,
  '../config',
  `config.${process.env.NODE_ENV || 'development'}.yml`,
);
// load files & merge config
const commonConfig = yaml.load(readFileSync(filePath, 'utf-8'));
const envConfig = yaml.load(readFileSync(envPath, 'utf-8'));

export default () => {
  return _.merge(commonConfig, envConfig);
};
