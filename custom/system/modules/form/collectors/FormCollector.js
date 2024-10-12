const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class FormCollector extends SystemCollector {

  /**
   * @param {string} path 
   */
  constructor(path = 'forms') {
    super('form', path, '**/*.form.js');
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

  /**
   * @param {string} name 
   * @returns {SystemItem}
   */
  add(name) {
    return super.add(name)
      .setAttribute('form_id', 'form.' + name)
      .setVolatile();
  }

}