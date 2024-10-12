const FieldBase = require('../FieldBase');

module.exports = class MessageField extends FieldBase {

  /**
   * @param {import('../collectors/FormFieldCollector')} collector 
   */
  static define(collector) {
    collector.add('message');
  }

  setDefault() {
    this.schema.tag = 'FormMessage';
  }

  setType(type) {
    this.schema.type = type;
    return this;
  }

  setMessage(message) {
    this.schema.message = message;
    return this;
  }

}