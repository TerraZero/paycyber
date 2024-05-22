/**
 * @typedef {Object} T_EntitySchema
 * @property {string} id
 * @property {string} label
 * @property {Object} settings
 */

/**
 * @typedef {Object} T_EntityDefinitionExtends
 * @property {T_FieldMap} fields
 * @typedef {T_EntitySchema & T_EntityDefinitionExtends} T_EntityDefinition
 */

/**
 * @typedef {Object} T_FieldMapExtends
 * @property {string} entitydefinition_id
 * @property {string} fielddefinition_id
 * @property {T_FieldStorage} storage
 * @typedef {T_EntitySchema & T_FieldMapExtends} T_FieldMap
 */

/**
 * @typedef {Object} T_FieldStorageExtends
 * @property {string} type
 * @typedef {T_EntitySchema & T_FieldStorageExtends} T_FieldStorage
 */ 

module.exports = class Definition {

  /**
   * @param {import('./Storage')} storage 
   * @param {T_EntityDefinition} definition 
   */
  constructor(storage, definition) {
    this.storage = storage;
    this.definition = definition;
  }

  get id() {
    return this.getEntity().id;
  }

  /**
   * @returns {T_EntityDefinition}
   */
  getEntity() {
    return this.definition;
  }

  /**
   * @param {string} field 
   * @returns {T_FieldMap}
   */
  getField(field) {
    return this.definition.fields.find(v => v.fielddefinition_id === field) ?? null;
  }

  /**
   * @param {string} field 
   * @returns {T_FieldStorage}
   */
  getFieldStorage(field) {
    return this.getField(field)?.storage ?? null;
  }

  /**
   * @param {string} field 
   * @param {string} label 
   * @param {Object} settings 
   * @param {T_FieldStorage} storage 
   */
  async addField(field, label = null, settings = {}, storage = null) {
    return this.storage.inTransaction(async () => {
      if (this.getField(field) !== null) return false;

      // create storage
      let fieldDefinition = await this.storage.getFieldDefinition(field);
      if (fieldDefinition === null && storage === null) {
        throw new Error('Field storage does not exist for field "' + field + '".');
      } else if (fieldDefinition === null) {
        await this.storage.addFieldDefinition(field, storage.label, storage.type, storage.settings ?? {});
        fieldDefinition = await this.storage.getFieldDefinition(field);
      }

      // create map
      await this.storage.addFieldMap(this.getEntity().id, field, label ?? fieldDefinition.label, settings);

      // update definition
      const map = await this.storage.getFieldMap(this.getEntity().id + '__' + field);
      map.storage = fieldDefinition;
      this.definition.fields.push(map);

      return true;
    });
  }

}
