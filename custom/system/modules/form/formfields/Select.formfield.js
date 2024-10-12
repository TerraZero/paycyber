const FieldBase = require('../FieldBase');

module.exports = class SelectField extends FieldBase {

  /**
   * @param {import('../collectors/FormFieldCollector')} collector 
   */
  static define(collector) {
    collector.add('select');
  }

  setDefault() {
    this.schema.tag = 'FormSelect';
  }

  /**
   * @param {Object<string, string>} options 
   * @returns {this}
   */
  setOptions(options) {
    this.schema.options = options;
    return this;
  }

  /**
   * @param {string} key 
   * @param {string} value 
   * @returns {this}
   */
  addOption(key, value) {
    this.schema.options ??= {};
    this.schema.options[key] = value;
    return this;
  }

}