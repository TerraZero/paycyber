module.exports = class FieldTypeBase {

  /**
   * @param {import('./Storage')} storage
   * @param {import('zero-system/src/SystemItem')} item 
   */
  constructor(storage, item) {
    this.storage = storage;
    this.item = item;
  }

  get type() {
    return this.item.getAttribute('fieldtype');
  }

  /**
   * @param {import('../form/FormBase')} form 
   * @param {import('../form/formfields/Group.formfield')} storage 
   */
  async formFieldStorage(form, storage) {

  }

  /**
   * @param {import('../form/FormBase')} form 
   * @param {import('../form/Model')} model 
   */
  async formFieldStorageValidate(form, model) {

  }

  /**
   * @param {import('../form/FormBase')} form  
   * @param {import('../form/formfields/Group.formfield')} map 
   */
  async formFieldMap(form, map) {

  }

  /**
   * @param {import('../form/FormBase')} form 
   * @param {import('../form/Model')} model 
   */
  async formFieldMapValidate(form, model) {

  }

  /**
   * @param {import('./forms/EntityTypeCreateField.form')} form 
   * @param {import('../form/Model')} model 
   */
  async formCreateSubmit(form, model) {
    
  }

  /**
   * @param {import('./Storage').T_FieldMap} definition 
   */
  async viewFieldMap(definition) {
    return definition;
  }

  /**
   * @param {import('./Storage').T_FieldMap} definition 
   */
  async createFieldMap(definition) {
    return await this.storage.database.fieldMap.create({
      data: {
        id: definition.entity + '__' + definition.field,
        label: definition.label,
        settings: JSON.stringify(definition.settings ?? {}),
        entity: definition.entity,
        field: definition.field,
      },
    });
  }

  /**
   * @param {import('./Storage').T_FieldMap} definition 
   */
  async updateFieldMap(definition) {
    const data = {};

    if (definition.label) data.label = definition.label;
    if (definition.settings) data.settings = JSON.stringify(definition.settings);

    return this.storage.database.fieldMap.update({
      where: {
        id: definition.id ?? definition.entity + '__' + definition.field,
      },
      data,
    });
  }

  /**
   * @param {import('./Storage').T_FieldMap} definition 
   */
  async deleteFieldMap(definition) {
    return this.storage.inTransaction(async tx => {
      const result = {};
      const id = definition.id ?? definition.entity + '__' + definition.field;

      result.field = await tx.field.deleteMany({
        where: {
          fieldmap_id: id,
        },
      });

      result.fieldmap = await tx.fieldMap.deleteMany({
        where: {
          id,
        },
      });
      return result;
    });
  }

  /**
   * @param {import('./Storage').T_FieldDefinition} definition 
   */
  async viewFieldDefinition(definition) {
    return definition;
  }

  /**
   * @param {import('./Storage').T_FieldDefinition} definition 
   */
  async createFieldDefinition(definition) {
    return this.storage.database.fieldDefinition.create({
      data: {
        id: definition.id,
        label: definition.label,
        type: definition.type,
        length: definition.length,
        settings: JSON.stringify(definition.settings ?? {}),
      },
    });
  }

  /**
   * @param {import('./Storage').T_FieldDefinition} definition 
   * @returns 
   */
  async updateFieldDefinition(definition) {
    const data = {};

    if (definition.label) data.label = definition.label;
    if (definition.settings) data.settings = JSON.stringify(definition.settings);

    return this.storage.database.fieldDefinition.update({
      where: {
        id: definition.id,
      },
      data,
    });
  }

  /**
   * @param {import('./Storage').T_FieldDefinition} definition 
   * @returns 
   */
  async deleteFieldDefinition(definition) {
    return this.storage.inTransaction(async tx => {
      const result = {};

      result.field = await tx.field.deleteMany({
        where: {
          fieldmap: {
            field: definition.id,
          },
        },
      });

      result.fieldmap = await tx.fieldMap.deleteMany({
        where: {
          field: definition.id,
        },
      });

      result.fielddefinition = await tx.fieldDefinition.deleteMany({
        where: {
          id: definition.id,
        },
      });

      return result;
    });
  }

  isMultipleField() {
    return false;
  }

  async viewField(sqlEntity, field, sqlValue, fieldValue) {
    throw new Error('Please implement the viewField method.');
  }

  /**
   * @param {import('./Definition')} definition 
   * @param {string} field 
   * @param {(any|any[])} value
   * @param {Object[]} fieldValue
   */
  async updateField(entity, field, value, fieldValue) {
    throw new Error('Please implement the updateField method.');
  }

  /**
   * @param {import('./Entity')} entity 
   * @param {string} field 
   */
  async cleanField(entity, field) {
    throw new Error('Please implement the cleanField method.');
  }

}