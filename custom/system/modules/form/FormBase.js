const Util = require('../utils/Util');
const SystemCollector = require('zero-system/src/SystemCollector');
const Jsonata = require('jsonata');
const Model = require('./Model');

module.exports = class FormBase {

  /**
   * @param {import('zero-system/src/SystemItem')} item 
   */
  constructor(item) {
    this.item = item;
    /** @type {import('./formfields/Form.formfield')} */
    this.form = null;
    this.model = new Model({});
    this.trigger = null;
    /** @type {import('./Form.module')} */
    this.formModule = SystemCollector.get('module.form');
    this.init();
  }

  init() {

  }

  /** @returns {string} */
  get id() {
    return this.item.getAttribute('form_id');
  }

  /**
   * @param {string} key 
   * @returns {any}
   */
  getInfo(key) {
    return this.form.getInfo(key);
  }

  async rebuild() {
    this.form.setInfo('rebuild', true);
    this.form.setInfo('builded', false);
    this.form.rebuild();
  }

  /**
   * @param {import('../form/formfields/Form.formfield')} form 
   * @param {Object} state
   * @param {Object} infos
   * @returns {this}
   */
  async doBuild(state = null, infos = null) {
    this.form ??= this.formModule.createForm(this.id);
    if (infos) this.form.setInfos(infos);
    if (state !== null) {
      this.form.setState(state);
      this.form.setInfo('rebuild', true);
      this.form.setInfo('builded', false);
    }
    if (!this.form.isBuilded()) {
      await this.doPrepare();
      await this.build(this.form);
      this.form.setInfo('builded', true);
      if (!this.form.isRebuild()) this.form.setInfo('build_id', Util.uuid());
    }
    return this;
  }

  async doPrepare() {
    await this.prepare();
  }

  async prepare() {

  }

  /**
   * @param {import('./Form.module')} form 
   */
  async build(form) {
    throw new Error('build method is not implemented');
  }

  /**
   * @param {(Model|Object)} model 
   * @returns {this}
   */
  setModel(model) {
    this.model = new Model(model);
    return this;
  }

  setTrigger(trigger) {
    this.trigger = trigger;
    return this;
  }

  async queryValue(jsonata) {
    return await Jsonata(jsonata).evaluate(this.model.data);
  }

  /**
   * @param {string} field
   * @returns {Model}
   */
  getModel(field = null) {
    if (field) return this.model.to(field);
    return this.model;
  }

  setRedirect(url) {
    this.form.state.redirect = {
      url,
    };
    return this;
  }

  getSchema() {
    return this.form.getSchema();
  }

  getState() {
    return this.form.state;
  }

  /**
   * @param {string} id 
   * @param {string} message 
   * @returns {this}
   */
  setError(id, message) {
    this.form.setError(id, message);
    return this;
  }

  async doSubmit(model = null, trigger = null) {
    if (model) this.setModel(model);
    if (trigger) this.setTrigger(trigger);
    this.form.reValidate();
    await this.doValidate();
    if (this.form.hasErrors()) {
      return false;
    } 
    await this.submit();
  }

  async doValidate() {
    try {
      await this.form.validate(this, null, this.getModel().data);
      await this.validate();
    } catch (e) {
      this.form.setError('', e.message);
      console.log(e);
    }
  }

  validate() {

  }

  async submit() {
    throw new Error('submit() not implemented');
  }

}