const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class SchemaController {

  static get id() { return 'form' }

  /**
   * @param {import('zero-system/src/ControllerCollector')} collector
   */
  static define(collector) {
    collector
      .addRoute('schema', 'form/:id/schema')
      .setAttribute('method', 'get');
    
    collector
      .addRoute('submit', 'form/:id/submit');
  }

  constructor() {
    /** @type {import('../Storage')} */
    this.storage = SystemCollector.get('storage');
    /** @type {import('../../form/Form.module')} */
    this.formModule = SystemCollector.get('module.form');
  }

  /**
   * @param {import('../../controller/Request')} request 
   */
  async schema(request) {
    try {
      const form = this.formModule.getForm(request.ROUTE.id);

      await form.doBuild(null, request.GET.info ? JSON.parse(request.GET.info) : null);

      request.setResponse({
        model: await form.getModel(),
        schema: await form.getSchema(),
        state: await form.getState(),
      });
    } catch (e) {
      console.log('Known Forms:');
      SystemCollector.each(item => {
        if (item.hasTag('form')) {
          console.log('- ' + item.name);
        }
      });
      throw new Error(`Error by generate form '${request.ROUTE.id}': ${e.message}`, e.code, e);
    }
  }

  /**
   * @param {import('../../controller/Request')} request 
   */
  async submit(request) {
    const form = this.formModule.getForm(request.ROUTE.id);

    form.setModel(request.POST.value);
    await form.doBuild(request.POST.state);
    await form.doSubmit(null, request.POST.trigger);

    request.setResponse({
      model: form.getModel(),
      schema: form.getSchema(),
      state: form.getState(),
    });
  }

}
