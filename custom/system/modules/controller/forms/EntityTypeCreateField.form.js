const SystemCollector = require('zero-system/src/SystemCollector');
const MultiFormBase = require('../../form/MultiFormBase');

module.exports = class EntityTypeCreateFieldForm extends MultiFormBase {

  /**
   * @param {import('../collectors/FormCollector')} collector
   */
  static define(collector) {
    collector.add('entity.type.create.field');
  }

  /**
   * @returns {Object<string, *>}
   */
  steps() {
    return {
      definition: 'Definition',
      storage: 'Storage',
    };
  }

  init() {
    /** @type {import('../Storage')} */
    this.storage = SystemCollector.get('storage');
    /** @type {import('../collectors/FieldTypeCollector')} */
    this.fieldTypes = SystemCollector.get('collector.fieldtype');
  }

  /**
   * @param {import('../../form/formfields/Form.formfield')} form 
   */
  async buildDefinition(form) {
    form
      .addField('string', 'id')
      .label('ID')
      .rule('Das ID Feld ist ein Pflichtfeld.').string().required();
    
    form
      .addField('string', 'label')
      .label('Label')
      .rule('Das Label Feld ist ein Pflichtfeld.').string().required();

    form
      .addField('select', 'type')
      .label('Type')
      .setOptions(this.fieldTypes.getFieldTypeOptions());

    form
      .addField('string', 'length')
      .label('Length');

    form
      .addField('actions', 'actions')
      .addField('submit', 'submit')
      .label('Weiter');
  }

  /**
   * @returns {import('../FieldTypeBase')}
   */
  getFormFieldType() {
    return this.storage.getFieldType(this.getModel().toString('type'));
  }

  /**
   * @param {import('../../form/formfields/Form.formfield')} form 
   */
  async buildStorage(form) {
    const fieldtype = this.getFormFieldType();
    const storage = form
      .addField('group', 'storage')
      .label('Storage')
      .setEmptyHide()
      .setBorder();
    const map = form
      .addField('group', 'map')
      .label('Map')
      .setEmptyHide()
      .setBorder();

    await fieldtype.formFieldStorage(this, storage);
    await fieldtype.formFieldMap(this, map);

    form
      .addField('actions', 'actions')
      .addField('submit', 'submit')
      .label('Create');
  }

  /**
   * @param {import('../../form/formfields/Form.formfield')} form 
   */
  async validateStorage(form) {
    const fieldtype = this.getFormFieldType();

    await fieldtype.formFieldStorageValidate(this, this.getModel('storage'));
    await fieldtype.formFieldMapValidate(this, this.getModel('map'));
  }

  async submit() {
    const model = this.getModel();
    const fieldtype = this.getFormFieldType();

    await fieldtype.formCreateSubmit(this, model);
  }

}