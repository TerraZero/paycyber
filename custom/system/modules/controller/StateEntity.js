const ActiveEntity = require('./ActiveEntity');

module.exports = class StateEntity {

  /**
   * @param {string} game 
   * @param {string} type 
   * @param {string} label 
   * @param {Object} defaults 
   * @returns {StateEntity}
   */
  static async load(game, type, label, defaults = {}, mount = null, map = {}) {
    const entity = new StateEntity(game, type, label, defaults);
    await entity.load();
    if (mount) {
      entity.mount(mount, map);
      entity.down();
    }
    return entity;
  }

  constructor(game, type, label, defaults = {}) {
    this.game = game;
    this.type = type;
    this.label = label;
    this.defaults = defaults;
    this._entity = null;
    this._mount = null;
    this._map = {};
  }

  mount(mount, map = {}) {
    this._mount = mount;
    this._map = map;
    return this;
  }

  async load() {
    this._entity = await ActiveEntity.single('Demo', {
      game: this.game,
      type: this.type,
      group: 'state',
    });
    if (this._entity === null) {
      this._entity = new ActiveEntity('Demo', {
        game: this.game,
        type: this.type,
        label: this.label,
        group: 'state',
        value: this.defaults,
      });
    }
    return this._entity;
  }

  get values() {
    return this._entity.values.value;
  }

  async save() {
    await this._entity.save();
  }

  async update(values = {}) {
    for (const field in values) {
      this.values[field] = values[field];
    }
    await this.save();
  }

  async up(...fields) {
    if (fields.length) {
      for (const field of fields) {
        this.values[field] = this._mount[this._map[field] ?? field];
      }
    } else {
      for (const field in this.values) {
        this.values[field] = this._mount[this._map[field] ?? field];
      }
    }
    await this.save();
  }

  down(...fields) {
    if (fields.length) {
      for (const field of fields) {
        this._mount[this._map[field] ?? field] = this.values[field];
      }
    } else {
      for (const field in this.values) {
        this._mount[this._map[field] ?? field] = this.values[field];
      }
    }
  }

};