const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class TestController {

  static get id() { return 'test' }

  /**
   * @param {import('zero-system/src/ControllerCollector')} collector
   */
  static define(collector) {
    collector
      .addRoute('serve', 'test/serve');
  }

  /**
   * @param {import('../Request')} request 
   */
  async serve(request) {
    /** @type {import('../Storage')} */
    const storage = SystemCollector.get('prisma');
    request.setResponse(await storage.getDefinitions());
  }

}