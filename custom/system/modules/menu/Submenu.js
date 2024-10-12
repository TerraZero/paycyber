const Group = require('./Group');

module.exports = class Submenu {

  constructor(key, icon) {
    this.key = key;
    this.icon = icon;
    /** @type {Group[]} */
    this.items = [];
  }

  build() {
    const items = [];
    for (const item in this.items) {
      items[item] = this.items[item].build();
    }
    return {
      icon: this.icon,
      items: items,
    };
  }

  /**
   * @param {string} key 
   * @param {string} label 
   * @returns {Group}
   */
  addGroup(key, label) {
    const exist = this.getGroup(key);
    if (exist) return exist;

    const group = new Group(key, label);
    this.items.push(group);
    return group;
  }

  /**
   * @param {string} key 
   * @returns {?Group}
   */
  getGroup(key) {
    return this.items.find(v => v.key === key);
  }

}
