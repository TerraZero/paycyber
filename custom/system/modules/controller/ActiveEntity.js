const Request = require('~/custom/frontend/Request');

module.exports = class ActiveEntity {

  static async multi(model, where, states = {}) {
    const models = await Request.create('schema/model/multi').deep('models').GET({
      model, 
      where,
    });

    return models.map(values => {
      return (new ActiveEntity(model, values)).setNew(false).setStates(JSON.parse(JSON.stringify(states)));
    });
  }

  /**
   * @param {string} model 
   */
  constructor(model, values = {}) {
    this.model = model;
    this._definition = null;
    this.isNew = true;
    this.values = values;
    this.states = {};
    this._save = true;
    this._saving = null;
  }

  async definition() {
    if (this._definition === null) {
      this._definition = await Request.create('schema/model').deep('model').GET({
        model: this.model,
      });
    }
    return this._definition;
  }

  setNew(isNew) {
    this.isNew = isNew;
    return this;
  }

  create(values) {
    this.values = values;
    this.isNew = true;
    return this;
  }

  async delete() {
    return await Request.create('schema/model/delete').deep('model').POST({
      model: this.model,
      where: {
        game: this.values.game,
        id: this.values.id,
      },
    });
  }

  async load(where) {
    this.values = await Request.create('schema/model/load').deep('model').GET({
      model: this.model,
      where,
    });
    this.isNew = this.values === null;
    return this;
  }

  async set(field, value) {
    this.values[field] = value;
    if (this._save) this.save();
    return this;
  }

  async get(field) {
    return this.values[field] ?? null;
  }

  setSave(save = false) {
    this._save = save;
    return this;
  }

  async setAll(callback) {
    this.setSave(false);
    await callback(this);
    this.setSave(true);
    this.save();
    return this;
  }

  save() {
    clearTimeout(this._saving);
    this._saving = setTimeout(() => {
      this.doSave();
    }, 500);
    return this;
  }

  async doSave() {
    clearTimeout(this._saving);
    this._saving = null;

    this.values = await Request.create('schema/model/save').deep('model').POST({
      model: this.model,
      data: this.values,
      isNew: this.isNew,
    });

    this.isNew = false;
    return this;
  }

  setStates(states) {
    this.states = states;
    return this;
  }

}