import SystemCollector from 'zero-system/src/SystemCollector';
import ZeroModule from 'zero-system/src/ZeroModule';
import EntityCollector from './collector/EntityCollector';

export default class EntityModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('entity');
  }

  boot() {
    SystemCollector.addCollector(new EntityCollector());
  }

}