const FieldBase = require('../FieldBase');

module.exports = class StringField extends FieldBase {

  /**
   * @param {import('../collectors/FormFieldCollector')} collector 
   */
  static define(collector) {
    collector.add('string');
  }

  setDefault() {
    this.schema.tag = 'FormInput';
  }

}