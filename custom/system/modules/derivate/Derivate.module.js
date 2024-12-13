const ZeroModule = require('zero-system/src/ZeroModule');

module.exports = class DerivateModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('derivate');
  }

}