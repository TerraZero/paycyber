const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class FieldTypeCollector extends SystemCollector {

  /**
   * @param {string} path 
   */
  constructor(path = 'fieldtypes') {
    super('fieldtype', path, '**/*.fieldtype.js');
    this._storage = null;
  }

  get storage() {
    if (this._storage === null) {
      this._storage = SystemCollector.get('storage');
    }
    return this._storage;
  }

  /**
   * @param {SystemItem} item 
   * @returns {Object}
   */
  doFactory(item) {
    if (item.info.construct && typeof item.info.construct.factory === 'function') return item.info.construct.factory(item);
    if (item.info.construct) return new item.info.construct(this.storage, item);
    return null;
  }

  /**
   * @param {string} name 
   * @param {string} label
   * @returns {SystemItem}
   */
  add(name, label) {
    return super
      .add(name)
      .setAttribute('type', name)
      .setAttribute('label', label)
      .setAttribute('fieldtype', name);
  }

  getFieldTypeOptions() {
    const options = {};

    /** @type {import('zero-system/src/SystemItem')[]} */
    const fieldtypes = SystemCollector.each(v => {
      return v.hasTag('fieldtype') ? v : null;
    });
    
    for (const fieldtype of fieldtypes) {
      options[fieldtype.getAttribute('type')] = fieldtype.getAttribute('label');
    }
    return options;
  }

}