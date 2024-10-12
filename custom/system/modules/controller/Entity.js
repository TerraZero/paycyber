module.exports = class Entity {

  /**
   * @param {import('./Definition')} definition 
   * @param {Object} data 
   */
  constructor(definition, data) {
    this.definition = definition;
    this.data = data;
    if (this.type === null) throw new Error('The entity type is required.');
  }

  get id() {
    return this.data.id;
  }

  get label() {
    return this.data.label ?? null;
  }

  get type() {
    return this.data.type ?? null;
  }

  getValue(field, index = null) {
    const value = this.data.fields[field];

    if (this.definition.getFieldStorage(field).length === 1) {
      return value[0];
    } else {
      return index === null ? value : (value[index] ?? null);
    }
  }

  setValue(field, value, index = null) {
    if (index === null) {
      value = Array.isArray(value) ? value : [value];
      if (value.length > this.definition.getFieldStorage(field).length) {
        throw new Error(`The field ${field} holds up to only ${this.definition.getFieldStorage(field).length} items.`);
      }
      this.data.fields[field] = value;
    } else {
      this.data.fields[field][index] = value;
    }
    this.data.fields[field] = this.data.fields[field].filter(v => v !== null);
    return this;
  }

  addValue(field, value) {
    if (this.data.fields[field].length + 1 > this.definition.getFieldStorage(field).length) {
      throw new Error(`The field ${field} holds up to only ${this.definition.getFieldStorage(field).length} items.`);
    }
    this.data.fields[field].push(value);
    this.data.fields[field] = this.data.fields[field].filter(v => v !== null);
    return this;
  }

}