/**
 * @typedef {Object} T_FieldMapExtends
 * @property {import('./Storage').T_FieldDefinition} storage
 * @typedef {import('./Storage').T_FieldMap & T_FieldMapExtends} T_FieldMap
 */ 

/**
 * @typedef {Object} T_EntityDef
 * @property {string} id
 * @property {string} label
 * @property {Object} settings
 * @property {T_FieldMap[]} fields
 */

module.exports = class Definition {

  /**
   * @param {import('./Storage')} storage 
   * @param {T_EntityDef} definition 
   */
  constructor(storage, definition) {
    this.storage = storage;
    this.definition = definition;
  }

  get id() {
    return this.getEntity().id;
  }

  /**
   * @returns {T_EntityDef}
   */
  getEntity() {
    return this.definition;
  }

  /**
   * @param {string} field 
   * @returns {T_FieldMap}
   */
  getField(field) {
    return this.definition.fields.find(v => v.field === field) ?? null;
  }

  /**
   * @param {string} field 
   * @returns {import('./Storage').T_FieldDefinition}
   */
  getFieldStorage(field) {
    return this.getField(field)?.storage ?? null;
  }

  /**
   * @param {string} field 
   * @returns {import('./FieldTypeBase')} 
   */
  getFieldType(field) {
    return this.storage.getFieldType(this.getFieldStorage(field).type);
  } 

  /**
   * @param {string} field 
   * @param {string} label 
   * @param {Object} settings 
   * @param {import('./Storage').T_FieldDefinition} storage 
   */
  async addField(field, label, settings = {}, storage = null) {
    return this.storage.inTransaction(async () => {
      if (this.getField(field) !== null) return false;

      // create storage
      let fieldDefinition = await this.storage.getFieldDefinition(field);
      if (fieldDefinition === null && storage === null) {
        throw new Error('Field storage does not exist for field "' + field + '".');
      } else if (fieldDefinition === null) {
        await this.storage.createFieldDefinition(storage);
        fieldDefinition = await this.storage.getFieldDefinition(field);
      }

      // create map
      await this.storage.createFieldMap({
        entity: this.getEntity().id,
        field: field,
        label: label,
        settings: settings,
      });

      // update definition
      const map = await this.storage.getFieldMap(this.getEntity().id + '__' + field);
      map.storage = fieldDefinition;
      this.definition.fields.push(map);

      return true;
    });
  }

}
