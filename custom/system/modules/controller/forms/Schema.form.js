const FormBase = require('../../form/FormBase');

module.exports = class SchemaForm extends FormBase {

  /**
   * @param {import('../collectors/FormCollector')} collector
   */
  static define(collector) {
    collector.add('schema');
  }

  /**
   * @param {import('../../form/Form')} form 
   */
  async build(form) {
    form.addField('string', 'single')
      .label('Single');
    
    form.addGroup('group')
      .label('Group')
      .addField('string', 'inner')
      .label('Inner')
      .multi(-1, 3)
      .multiLabel('Inner ${index}');
  }

}