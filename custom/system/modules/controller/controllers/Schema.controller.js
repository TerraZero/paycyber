const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class SchemaController {

  static get id() { return 'schema' }

  /**
   * @param {import('zero-system/src/ControllerCollector')} collector
   */
  static define(collector) {
    collector
      .addRoute('entity', 'schema/entity');

    collector
      .addRoute('test', 'schema/test');
  }

  /**
   * @param {import('../Request')} request 
   */
  async entity(request) {
    /** @type {import('../Storage')} */
    const storage = SystemCollector.get('storage');
    request.setResponse((await storage.getDefinitions()).find(v => v.getEntity().id === request.getBody().entity));
  }

  /**
   * @param {import('../Request')} request 
   */
  async test(request) {
    /** @type {import('../Storage')} */
    const storage = SystemCollector.get('storage');

    await storage.inTransaction(async () => {
      await storage.addEntityDefinition('test2', 'Test');

      const definition = (await storage.getDefinitions()).find(v => v.id === 'test2');
      await definition.addField('file', null, {}, {
        label: 'File',
        type: 'string',
      });

      request.setResponse((await storage.getDefinitions()).find(v => v.getEntity().id === 'test2').definition);
    });
  }

}