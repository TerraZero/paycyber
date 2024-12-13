const SystemCollector = require('zero-system/src/SystemCollector');
const Util = require('../../utils/Util');
const FS = require('fs');
const Path = require('path');
const FileUtil = require('../../utils/FileUtil');
const Sharp = require('sharp');

module.exports = class DerivateController {

  static get id() { return 'derivate' }

  /**
   * @param {import('zero-system/src/ControllerCollector')} collector
   */
  static define(collector) {
    collector
      .addRoute('getter', 'derivate/getter')
      .setAttribute('method', 'get');
  }

  constructor() {
    /** @type {import('../../controller/Storage')} */
    this.storage = SystemCollector.get('storage');
  }

  /**
   * @param {import('../../controller/Request')} request 
   */
  async getter(request) {
    try {
      let cid = [];
      cid.push('method:sharp');
      cid.push('resize:' + (request.GET.resize ?? '#'));
      cid = cid.join(';');

      let image = await this.storage.database.imageDerivate.findFirst({
        where: {
          image: request.GET.image,
          cid,
        },
      });

      if (!image) {
        image = {
          image: request.GET.image,
          derivate: Util.uuid(),
          cid,
        };
        await this.storage.database.imageDerivate.create({
          data: image,
        });
      }

      const root = 'derivate/sharp';
      const rel = Path.join(__dirname, '../../../../../static');
      const path = Path.join(root, image.derivate + Path.extname(image.image));
      const realpath = Path.join(rel, path);
      let generated = false;

      if (!FS.existsSync(realpath)) {
        if (!FS.existsSync(Path.join(rel, root))) {
          FileUtil.prepareDirectorySync(rel, root);
        }
        let source = null;
        if (image.image.startsWith('/')) {
          source = Path.join(rel, image.image);
        } else {
          const Fetch = await import('node-fetch');
          const fetched = await Fetch.default(image.image);
          source = Buffer.from(await fetched.arrayBuffer());
        }
        
        let sharper = Sharp(source);
        if (request.GET.resize) {
          sharper = sharper.resize(...request.GET.resize.split(',').map(v => parseInt(v.trim())));
        }
        await sharper.toFile(realpath);
        generated = true;
      }

      request.setResponse({ image, path: '\\' + path, generated });
    } catch (e) {
      console.log('DERIVATE: ' + e.message, e);
      request.debug();
    }
  }

}
