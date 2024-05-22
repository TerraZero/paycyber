import Path from 'path';
import Express from 'express';
import { PrismaClient } from '@prisma/client';

import ZeroRoot from 'zero-system/src/ZeroRoot';
import SystemCollector from 'zero-system/src/SystemCollector';
import Storage from './modules/controller/Storage';

const prisma = new PrismaClient();
const app = Express();

app.use(Express.json());

export default {
  path: '/api',
  handler: app,
};

const root = new ZeroRoot(__dirname, app);

SystemCollector.addPath(Path.join(__dirname, 'modules/controller'));
SystemCollector.set('storage', new Storage(prisma));

root.boot();
root.init();


/*

app.post('/model/type', async (req, res) => {
  let prepare = {};
  try {
    const request = api.request(req, res);

    await request.setResultItem(await api.modelStorage.getTypes());
    await request.send();
  } catch (e) {
    res.send(await api.processError(e, prepare));
  }
});

*/