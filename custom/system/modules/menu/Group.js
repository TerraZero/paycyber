const Item = require('./Item');

module.exports = class Group {

  constructor(key, label) {
    this.key = key;
    this.label = label;
    /** @type {Item[]} */
    this.items = [];
  }

  build() {
    const items = {};
    for (const item of this.items) {
      items[item.key] = item.build();
    }
    return {
      title: this.label,
      items: items,
    };
  }

  /**
   * @param {string} key 
   * @param {string} label 
   * @param {string} url
   * @param {Object} params
   * @returns {Item}
   */
  addItem(key, label, url, params = {}) {
    const exist = this.getItem(key);
    if (exist) return item;

    const item = new Item(key, label, url, params);
    this.items.push(item);
    return item;
  }

  /**
   * @param {string} key 
   * @returns {?Item}
   */
  getItem(key) {
    return this.items.find(v => v.key === key);
  }

}
