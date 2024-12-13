const Path = require('path');
const Glob = require('glob');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {

  const images = await prisma.demo.findMany({
    where: {
      game: 'myz',
      type: 'screen.image',
    },
  });

  for (const image of images) {
    const value = JSON.parse(image.value);

    if (value.src.startsWith('https://cdn.midjourney.com/')) {
      const newpath = '/media/demo/paycyber/image/' + value.src.split('/')[3] + '.png';
      value.src = newpath;
      image.value = JSON.stringify(value);
      await prisma.demo.update({
        where: {
          id: image.id,
        },
        data: {
          value: image.value,
        },
      });
    }
  }

})();