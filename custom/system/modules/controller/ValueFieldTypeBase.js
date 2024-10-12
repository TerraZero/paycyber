const FieldTypeBase = require('./FieldTypeBase');

module.exports = class ValueFieldTypeBase extends FieldTypeBase {

  /**
   * @param {import('../form/FormBase')} form 
   * @param {import('../form/formfields/Group.formfield')} storage 
   */
  async formFieldStorage(form, storage) {
    storage
      .addField('string', 'max')
      .label('Max');
  }

  /**
   * @param {import('../form/FormBase')} form 
   * @param {import('../form/formfields/Group.formfield')} map 
   */
  async formFieldMap(form, map) {
    map
      .addField('string', 'label')
      .label('Label');
  }

  /**
   * @param {import('./forms/EntityTypeCreateField.form')} form 
   * @param {import('../form/Model')} model 
   */
  async formCreateSubmit(form, model) {
    await form.storage.createFieldDefinition({
      id: model.toString('id'),
      label: model.toString('label'),
      length: model.toInt('length'),
      type: model.toString('type'),
      settings: model.toMap('storage', (storage) => {
        return {
          max: storage.toInt('max', 255),
        };
      }),
    });

    await form.storage.createFieldMap({
      entity: form.getInfo('type'),
      field: model.toString('id'),
      label: model.toString('map.label'),
    });
  }

  async viewField(sqlEntity, field, sqlValue, fieldValue) {
    return sqlValue.value;
  }

  /**
   * @param {import('./Entity')} entity 
   * @param {string} field 
   * @param {(any|any[])} value
   * @param {Object[]} fieldValue
   */
  async updateField(entity, field, value, fieldValue) {
    await this.storage.database.field.create({
      data: {
        fieldmap_id: `${entity.type}__${field}`,
        entity_id: entity.id,
        value,
      },
    });
  }

  /**
   * @param {import('./Entity')} entity 
   * @param {string} field 
   */
  async cleanField(entity, field) {
    await this.storage.database.field.deleteMany({
      where: {
        entity_id: entity.id,
        fieldmap: {
          field,
        },
      },
    });
  }

}