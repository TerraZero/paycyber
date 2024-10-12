const DeepData = require('utils/src/DeepData');

/**
 * @typedef {function(import('./Model'))} modalCallback
 */

module.exports = class Model {

  constructor(data) {
    this.data = data;
  }

  /**
   * @param {string} field 
   * @param {any} value 
   * @returns {this}
   */
  set(field, value) {
    DeepData.setDeep(this.data, field, value);
    return this;
  }

  /**
   * @param {string} field 
   * @param {any} fallback 
   * @returns {any}
   */
  get(field, fallback = null) {
    return DeepData.getDeep(this.data, field, fallback);
  }

  /**
   * @param {string} field 
   * @param {any} fallback 
   * @returns {Model}
   */
  to(field, fallback = {}) {
    const value = this.get(field, fallback);
    if (value === null) return null;
    return new Model(value);
  }

  /**
   * @param {string} field 
   * @param {any} fallback 
   * @param {boolean} check 
   * @returns {string}
   */
  toString(field, fallback = null, check = false) {
    const value = this.get(field, fallback);
    if (check && typeof value !== 'string') {
      throw new Error(`Model cast: the field ${field} is not of type string.`)
    }
    return value + '';
  }

  /**
   * @param {string} field 
   * @param {any} fallback 
   * @param {boolean} check 
   * @returns {Number}
   */
  toInt(field, fallback = null, check = false) {
    let value = this.get(field, fallback);
    if (value === null) return null;
    value = Number.parseInt(value);
    if (check && value + '' !== this.get(field, fallback) + '') {
      throw new Error(`Model cast: the field ${field} is not of type int.`);
    }
    return value;
  }

  /**
   * @param {string} field 
   * @param {any} fallback 
   * @param {boolean} check 
   * @returns {Number}
   */
  toNumber(field, fallback = null, check = false) {
    let value = this.get(field, fallback);
    if (value === null) return null;
    value = Number.parseFloat(value);
    if (check && value + '' !== this.get(field, fallback) + '') {
      throw new Error(`Model cast: the field ${field} is not of type float.`);
    }
    return value;
  }

  /**
   * @param {string} field 
   * @param {modalCallback} mapCallback 
   * @param {any} fallback 
   * @returns {any}
   */
  toMap(field, mapCallback, fallback = null) {
    const value = this.get(field, fallback);
    if (value === null) return null;
    return mapCallback(new Model(value));
  }

}