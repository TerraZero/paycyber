const FieldBase = require('../FieldBase');

module.exports = class ButtonField extends FieldBase {

  /**
   * @param {import('../collectors/FormFieldCollector')} collector 
   */
  static define(collector) {
    collector.add('button');
  }

  setDefault() {
    this.schema.tag = 'FormButton';
  }

}