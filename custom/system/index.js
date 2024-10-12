import Path from 'path';
import Express from 'express';
import { PrismaClient } from '@prisma/client';

import ZeroRoot from 'zero-system/src/ZeroRoot';
import SystemCollector from 'zero-system/src/SystemCollector';
import Storage from './modules/controller/Storage';
import Models from './modules/controller/Models';

const prisma = new PrismaClient();
const app = Express();

app.use(Express.json());

export default {
  path: '/api',
  handler: app,
};

const root = new ZeroRoot(__dirname, app);

//SystemCollector.debug = true;

SystemCollector.addPath(Path.join(__dirname, 'modules/controller'));
SystemCollector.addPath(Path.join(__dirname, 'modules/form'));
SystemCollector.addPath(Path.join(__dirname, 'modules/utils'));
SystemCollector.addPath(Path.join(__dirname, 'modules/menu'));
SystemCollector.addPath(Path.join(__dirname, 'modules/demo'));

SystemCollector.set('models', new Models());
SystemCollector.set('storage', new Storage(prisma));

root.boot();
root.init();