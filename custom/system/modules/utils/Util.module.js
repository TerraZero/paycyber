const SystemCollector = require('zero-system/src/SystemCollector');
const ZeroModule = require('zero-system/src/ZeroModule');
const EventCollector = require('./collectors/EventCollector');

module.exports = class FormModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('util');
  }

  boot() {
    SystemCollector.addCollector(new EventCollector());
  }

  async emit(event, ...args) {
    await SystemCollector.eachAsync(async item => {
      if (item.hasTag('event') && typeof item.getObject()[event] === 'function') {
        await item.getObject()[event](...args);
      }
    });
  }

}