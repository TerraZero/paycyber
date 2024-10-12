const Submenu = require('./Submenu');
const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class Menu {

  constructor() {
    /** @type {Submenu[]} */
    this.items = [];
    /** @type {import('../utils/Util.module')} */
    this.utilModule = SystemCollector.get('module.util');
    this.created = false;
  }

  async create() {
    if (this.created) return this;
    await this.utilModule.emit('menuCreate', this);
    this.created = true;
    return this;
  }

  build() {
    const build = {};
    
    for (const item of this.items) {
      build[item.key] = item.build();
    }
    return build;
  }

  /**
   * @param {string} key 
   * @param {string} icon 
   * @returns {Submenu}
   */
  addMenu(key, icon) {
    const exist = this.getMenu(key);
    if (exist) return exist;
    
    const sub = new Submenu(key, icon);
    this.items.push(sub);
    return sub;
  }

  /**
   * @param {string} key 
   * @returns {?Submenu}
   */
  getMenu(key) {
    return this.items.find(v => v.key === key);
  }

}
