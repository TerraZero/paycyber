const SystemCollector = require('zero-system/src/SystemCollector');
const ZeroModule = require('zero-system/src/ZeroModule');
const FormCollector = require('./collectors/FormCollector');
const FormFieldCollector = require('./collectors/FormFieldCollector');

module.exports = class FormModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('form');
  }

  boot() {
    SystemCollector.addCollector(new FormFieldCollector());
    SystemCollector.addCollector(new FormCollector());
  }

  /**
   * @param {string} id 
   * @returns {import('./formfields/Form.formfield')}
   */
  createForm(id) {
    const form = SystemCollector.get('formfield.form');
    form.setID(id);
    return form;
  }

  /**
   * @param {string} id 
   * @returns {import('./FormBase')}
   */
  getForm(id) {
    return SystemCollector.get(id);
  }

}