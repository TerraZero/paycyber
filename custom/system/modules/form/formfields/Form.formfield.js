const GroupField = require('./Group.formfield');

module.exports = class FormField extends GroupField {

  /**
   * @param {import('../collectors/FormFieldCollector')} collector 
   */
  static define(collector) {
    collector.add('form');
  }

  constructor(...args) {
    super(...args);
    this.rules = [];
    this.state = {};
    this.root = this;
  }

  setID(id) {
    this.id = id;
    return this;
  }

  setState(state) {
    this.state = state;
    return this;
  }

  setInfos(infos) {
    this.state.info = infos;
    return this;
  }

  /**
   * @param {string} key 
   * @param {*} value 
   * @returns {this}
   */
  setInfo(key, value) {
    this.state.info ??= {};
    this.state.info[key] = value;
    return this;
  }

  /**
   * @param {string} key 
   * @returns {*}
   */
  getInfo(key) {
    if (!this.state.info) return null;
    return this.state.info[key] ?? null;
  }

  /**
   * @returns {boolean}
   */
  isBuilded() {
    return this.state.info?.builded ?? false;
  }

  /**
   * @returns {boolean}
   */
  isRebuild() {
    return this.state.info?.rebuild ?? false;
  }

  /**
   * @param {string} id 
   * @param {string} message 
   * @returns {this}
   */
  setError(id, message) {
    this.state.errors ??= [];
    let found = this.state.errors.findIndex(v => v.id === id);
    if (found === -1) {
      found = this.state.errors.length;
      this.state.errors.push({
        id,
        messages: []
      });
    }
    this.state.errors[found].messages.push(message);
    return this;
  }

  /**
   * @returns {boolean}
   */
  hasErrors() {
    return this.state.errors?.length > 0 ?? false;
  }

  /**
   * @returns {this}
   */
  reValidate() {
    this.state.errors = [];
    return this;
  }

  getSchema() {
    const schema = super.getSchema();
    schema.id = this.id;
    return schema;
  }

  /**
   * @param {import('./FormBase')} form 
   * @param {string} id
   * @param {*} value
   */
  async validate(form, id, value) {
    const v = await this.prepareValue(form, id, value);
    await this.validateRules(form, id, v);

    for (const field of this.fields) {
      await field.validate(form, field.model, v[field.model] ?? null);
    }
  }

  addRule(rule) {
    this.rules.push(rule);
    return this;
  }

}