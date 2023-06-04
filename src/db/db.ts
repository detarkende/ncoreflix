import { join } from 'node:path';

import { JsonDB, Config } from 'node-json-db';
import { env } from '@/environment/server';

// db.json file path
const file = join(env.DOCKER_WORKDIR, `./db.json`);

export const db = new JsonDB(new Config(file, true, true, '/'));
