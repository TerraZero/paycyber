const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class MYZController {

  static get id() { return 'myz' }

  /**
   * @param {import('zero-system/src/ControllerCollector')} collector
   */
  static define(collector) { 
    collector
      .addRoute('load.options', 'demo/myz/load-options', 'loadOptions');

    collector
      .addRoute('test', 'demo/test');
  }

  constructor() {
    /** @type {import('../../controller/Storage')} */
    this.storage = SystemCollector.get('storage');
  }

  /**
   * @param {import('../../controller/Request')} request 
   */
  async loadOptions(request) {
    try {
      const options = await this.storage.database.demo.findMany({
        where: {
          game: 'myz',
          type: request.POST.type,
        },
      });
      options.forEach(v => {
        v.value = JSON.parse(v.value ?? '{}');
      });
      request.setResponse({ options });
    } catch (e) {
      console.log('DEMO: ' + e.message, e);
      request.debug();
    }
  }

  /**
   * @param {import('../../controller/Request')} request 
   */
  async test(request) {
    try {
      const table = await this.storage.getSQLTableInfo(request.POST.table);
      request.setResponse({ table });
    } catch (e) {
      console.log('DEMO: ' + e.message, e);
      request.debug();
    }
  }

}
