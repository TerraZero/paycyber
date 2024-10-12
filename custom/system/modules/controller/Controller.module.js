const SystemCollector = require('zero-system/src/SystemCollector');
const ControllerCollector = require('zero-system/src/ControllerCollector');
const ZeroModule = require('zero-system/src/ZeroModule');
const Request = require('./Request');
const FieldTypeCollector = require('./collectors/FieldTypeCollector');

module.exports = class ControllerModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('controller');
  }

  /** @returns {ControllerCollector} */
  get collector() {
    return SystemCollector.get('collector.controller');
  }

  boot() {
    SystemCollector.addCollector(new ControllerCollector());
    SystemCollector.addCollector(new FieldTypeCollector());
  }

  init() {
    const routes = SystemCollector.each(item => {
      if (item.hasTag('route')) return item;
    });
    
    for (const route of routes) {
      this.root.app[route.getAttribute('method') ?? 'post']('/' + route.getAttribute('path'),  async (req, res) => {
        await this.request(route.getAttribute('method') ?? 'post', route.getAttribute('path'), new Request(req, res));
      });
    }
    this.root.app.get('*', (req, res) => {
      const request = new Request(req, res);

      request.debug();
      request.setResponse({
        error: 'No GET API Route found.',
      });
      this.finishRequest(request);
    });
    this.root.app.post('*', (req, res) => {
      const request = new Request(req, res);

      request.debug();
      request.setResponse({
        error: 'No POST API Route found.',
      });
      this.finishRequest(request);
    });
  }

  getService(method, path) {
    return SystemCollector.find(item => item.getAttribute('path') === path && (item.getAttribute('method') ?? 'post') === method);
  }

  /**
   * @param {string} method 
   * @param {srting} path 
   * @param {import('./Request')} request 
   */
  async request(method, path, request) {
    await this.doRequest(method, path, request);
    await this.finishRequest(request);
  }

  /**
   * @param {string} method 
   * @param {srting} path 
   * @param {import('./Request')} request 
   */
  async doRequest(method, path, request) {
    let service = null;
    try {
      service = this.getService(method, path);

      await service.getAction('route')(request);
    } catch (e) {
      console.log(e);
      console.log(service);
      request.setError(Request.ERROR_UNKNOWN, e.message, e);
    }
  }

  /**
   * @param {import('./Request')} request 
   */
  async finishRequest(request) {
    if (request.sended) return;
    await request.send();
  }

}