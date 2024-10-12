const Util = require('../utils/Util');
const FormBase = require('./FormBase');

module.exports = class MultiFormBase extends FormBase {

  /**
   * @param {import('zero-system/src/SystemItem')} item 
   */
  constructor(item) {
    super(item);
  }

  /**
   * @returns {Object<string, *>}
   */
  steps() {
    throw new Error('steps method is not implemented');
  }

  /** @returns {string} */
  get step() {
    const step = this.form.getInfo('step');
    return this.steps()[step];
  }

  setNextStep() {
    const steps = this.steps();
    const step = this.form.getInfo('step');

    if (!step) {
      this.form.setInfo('step', Util.getIndex(steps));
    } else {
      this.form.setInfo('step', Util.getIndex(steps, Util.getIndexKey(steps, step) + 1));
    }
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
    if (!this.form.getInfo('step')) this.setNextStep();
    if (!this.form.isBuilded()) {
      await this.doPrepare();
      await this.build(this.form);
      await this.buildStep(this.form);
      await this.buildAfter(this.form);
      this.form.setInfo('builded', true);
      if (!this.form.isRebuild()) this.form.setInfo('build_id', Util.uuid());
    }
    return this;
  }

  /**
   * @param {import('./formfields/Form.formfield')} form 
   */
  async build(form) { }

  /**
   * @param {import('./formfields/Form.formfield')} form 
   */
  async buildAfter(form) { }

  /**
   * @param {import('./formfields/Form.formfield')} form 
   */
  async buildStep(form) {
    const stepData = this.step;

    if (typeof stepData === 'object' && (stepData.callback ?? false)) {
      await this[stepData.callback](form);
    } else {
      await this['build' + Util.ucFirst(form.getInfo('step'))](form);
    }
  }

  async doSubmit(model = null, trigger = null) {
    if (model) this.setModel(model);
    if (trigger) this.setTrigger(trigger);
    this.form.reValidate();
    await this.doValidate();
    if (this.form.hasErrors()) {
      return false;
    }

    const steps = this.steps();
    const step = this.form.getInfo('step');

    if (Util.getIndexKey(steps, step) + 1 === Util.getObjectLength(steps)) {
      await this.submit();
    } else {
      this.setNextStep();
      await this.rebuild();
      await this.doBuild();
    }
  }

  async doValidate() {
    try {
      const stepData = this.step;

      if (typeof stepData === 'object' && (stepData.callback ?? false)) {
        if (typeof this[stepData.callback + 'Validate'] === 'function') {
          await this[stepData.callback + 'Validate'](this.form);
        }
      } else if (typeof this['validate' + Util.ucFirst(this.form.getInfo('step'))] === 'function') {
        await this['validate' + Util.ucFirst(this.form.getInfo('step'))](this.form);
      }
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