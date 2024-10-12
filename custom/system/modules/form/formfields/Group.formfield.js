const SystemCollector = require('zero-system/src/SystemCollector');
const FieldBase = require('../FieldBase');

module.exports = class GroupField extends FieldBase {

  /**
   * @param {import('../collectors/FormFieldCollector')} collector 
   */
  static define(collector) {
    collector.add('group');
  }

  /**
   * @param {import('zero-system/src/SystemItem')} item 
   */
  constructor(item) {
    super(item);
    /** @type {FieldBase[]} */
    this.fields = [];
  }

  setDefault() {
    this.schema.tag = 'FormGroup';
  }

  rebuild() {
    this.fields = [];
    return this;
  }

  setBorder(border = true) {
    this.schema.border = border;
    return this;
  }

  setEmptyHide(empty_hide = true) {
    this.schema.empty_hide = empty_hide;
    return this;
  }

  /**
   * @param {string} type 
   * @param {string} model 
   * @returns {(FieldBase|GroupField)}
   */
  addField(type, model) {
    /** @type {FieldBase} */
    const field = SystemCollector.get('formfield.' + type);
    field.setModel(model);
    field.root = this.root;
    this.fields.push(field);
    return field;
  }

  /**
   * @param {string} id
   * @returns {?FieldBase}
   */
  getField(id) {
    const split = id.split('.');
    return split.length === 1 ? this.field(split[0]) : this.field(split.shift())?.getField(split.join('.') ?? null);
  }

  field(model) {
    return this.fields.find(v => v.model === model);
  }

  getSchema() {
    const fields = [];
    for (const field of this.fields) {
      fields.push(field.getSchema());
    }
    const schema = JSON.parse(JSON.stringify(this.schema));
    schema.fields = fields;
    return schema;
  }

  /**
   * @param {import('./FormBase')} form 
   * @param {string} id
   * @param {*} value
   */
  async validate(form, id, value) {
    await super.validate(form, id, value);
    const v = await this.prepareValue(form, id, value);

    if (this.isMulti()) {
      for (const index in v) {
        for (const field of this.fields) {
          await field.validate(form, id + '.' + index + '.' + field.model, v ? v[index][field.model] ?? null : null);
        }    
      }
    } else {
      for (const field of this.fields) {
        await field.validate(form, id + '.' + field.model, v ? v[field.model] ?? null : null);
      }
    }
  }

}