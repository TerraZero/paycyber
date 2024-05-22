const SystemCollector = require('zero-system/src/SystemCollector');
const ControllerCollector = require('zero-system/src/ControllerCollector');
const ZeroModule = require('zero-system/src/ZeroModule');
const Request = require('./Request');

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
  }

  init() {
    const routes = SystemCollector.each(item => {
      if (item.hasTag('route')) return item;
    });
    
    for (const route of routes) {
      this.root.app.post('/' + route.getAttribute('path'),  async (req, res) => {
        await this.request(route.getAttribute('path'), new Request(req, res));
      });
    }
  }

  getService(path) {
    return SystemCollector.find(item => item.getAttribute('path') === path);
  }

  async request(path, request) {
    await this.doRequest(path, request);
    await this.finishRequest(request);
  }

  async doRequest(path, request) {
    const service = this.getService(path);

    await service.getAction('route')(request);
  }

  async finishRequest(request) {
    if (request.sended) return;
    await request.send();
  }

}