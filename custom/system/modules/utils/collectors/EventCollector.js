const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class EventCollector extends SystemCollector {

  /**
   * @param {string} path 
   */
  constructor(path = 'events') {
    super('event', path, '**/*.event.js');
  }

  /**
   * @param {SystemItem} item 
   * @returns {Object}
   */
  doFactory(item) {
    if (item.info.construct && typeof item.info.construct.factory === 'function') return item.info.construct.factory(item);
    if (item.info.construct) return new item.info.construct(item);
    return null;
  }

}