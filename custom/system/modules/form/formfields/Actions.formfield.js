const GroupField = require('./Group.formfield');

module.exports = class ActionsGroup extends GroupField {

  /**
   * @param {import('../collectors/FormFieldCollector')} collector 
   */
  static define(collector) {
    collector.add('actions');
  }

  setDefault() {
    this.schema.tag = 'FormActions';
  }

}