const Yup = require('yup');

/**
 * @typedef {function(import('./FieldBase'))} fieldCallback
 */

module.exports = class FieldBase {

  /**
   * @param {import('zero-system/src/SystemItem')} item 
   */
  constructor(item) {
    this.item = item;
    this.schema = {
      type: item.name,
    };
    this.rules = [];
    this.root = null;
    this.setDefault();
  }

  /** @returns {string} */
  get model() {
    return this.schema.model;
  }

  setModel(model) {
    this.schema.model = model;
    return this;
  }

  setDefault() {
    throw new Error('setDefault() is not implemented');
  }

  /**
   * @param {String} type 
   * @returns {this}
   */
  label(label) {
    this.schema.label = label;
    return this;
  }

  isMulti() {
    return this.schema.multi && (this.schema.multi.length > 1 || this.schema.multi.length === -1);
  }

  /**
   * @param {number} length 
   * @param {number} min 
   * @returns {this}
   */
  multi(length, min = null, compact = true) {
    this.schema.multi = {
      length,
    };
    if (min) this.schema.multi.min = min;
    return this;
  }

  infinity() {
    this.schema.multi ??= {};
    this.schema.multi.length = -1;
    return this;
  }

  /**
   * @param {string} label 
   */
  multiLabel(label) {
    this.schema.multi.label = label;
    return this;
  }

  getSchema() {
    return this.schema;
  }

  /**
   * @param {string} message 
   * @param {CallableFunction} callback 
   * @returns {(this|Proxy<typeof Yup>)}
   */
  rule(message = null, callback = null) {
    const rule = {
      message,
    };
    this.rules.push(rule);
    if (callback === null) {
      rule.yup = Yup;
      rule.proxy = new Proxy({}, {

        get(target, prop, receiver) {
          if (typeof rule.yup[prop] === 'function') {
            return (...args) => {
              rule.yup = rule.yup[prop](...args);
              return rule.proxy;
            };
          }
        },

      });
      return rule.proxy;
    } else {
      rule.rule = callback;
      return this;
    }
  }

  /**
   * @param {string} message 
   * @param {CallableFunction} callback 
   * @returns {this}
   */
  multiRule(message, callback) {
    this.rule(message, (value) => {
      for (const index in value) {
        const result = callback(value[index], index, value);
        if (typeof result === 'string' && result.length > 0 || result === false) {
          return message ?? result;
        }
      }
      return true;
    });
    return this;
  }

  /**
   * @param {fieldCallback} callback 
   * @returns {this}
   */
  addRules(callback) {
    callback(this);
    return this;
  }

  /**
   * @param {import('./FormBase')} form 
   * @param {string} id
   * @param {*} value
   * @returns {*}
   */
  async prepareValue(form, id, value) {
    if (this.isMulti()) {
      return value === null ? [] : (Array.isArray(value) ? value : [value]);
    }
    return value;
  }

  /**
   * @param {import('./FormBase')} form 
   * @param {string} id
   * @param {*} value
   */
  async validate(form, id, value) {
    const v = await this.prepareValue(form, id, value);
    await this.validateRules(form, id, v);
  }

  /**
   * @param {import('./FormBase')} form 
   * @param {string} id 
   * @param {*} value 
   */
  async validateRules(form, id, value) {
    for (const rule of this.rules) {
      try {
        let message = null;
        if (rule.yup) {
          await rule.yup.validate(value);
        } else {
          message = await rule.rule(value);
        }
        if (typeof message === 'string' && message.length > 0 || message === false) {
          form.setError(id, rule.message ?? message);
        }
      } catch (e) {
        form.setError(id, e.message);
      }
    }
  }

}