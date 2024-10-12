const Path = require('path');
const Glob = require('glob');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const files = Glob.sync('**/*.seed.json', {
  cwd: Path.join(__dirname, '../custom/seed'),
  absolute: true,
});

(async () => {

  for (const file of files) {
    const data = require(file);
    
    for (const table in data) {
      const config = data[table].config;
  
      for (const item of data[table].items) {
        let idFields = config.id;
        let jsonFields = config.json ?? [];
        let base = config.base ? 'default' : false;
        const where = {};
        const update = {};
        const create = {};

        const addField = (field, value) => {
          if (idFields.includes(field)) {
            where[field] = value;
          } else {
            if (jsonFields.includes(field)) {
              update[field] = JSON.stringify(value);
            } else {
              update[field] = value;
            }
          }
          if (jsonFields.includes(field)) {
            create[field] = JSON.stringify(value);
          } else {
            create[field] = value;
          }
        };
  
        for (const field in item) {
          if (field === '#id') {
            idFields = item[field];
            continue;
          }
          if (field === '#json') {
            jsonFields = item[field];
            continue;
          }
          if (field === '#base') {
            base = item[field];
            continue;
          }

          if (base) {
            for (const baseField in config.base[base]) {
              addField(baseField, config.base[base][baseField]);
            }
            base = false;
          }

          addField(field, item[field]);
        }

        const exist = await prisma[table].findFirst({
          where,
        });

        if (exist) {
          await prisma[table].update({
            where: {
              id: exist.id,
            },
            data: update,
          });
        } else {
          await prisma[table].create({
            data: create,
          });
        }
      }
    }
  }

})();
