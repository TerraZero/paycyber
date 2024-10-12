const ValueFieldTypeBase = require('../ValueFieldTypeBase');

module.exports = class StringFieldType extends ValueFieldTypeBase {

  /**
   * @param {import('../collectors/FieldTypeCollector')} collector 
   */
  static define(collector) {
    collector.add('string', 'String');
  }

}