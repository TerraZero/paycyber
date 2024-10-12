const UUID = require('uuid').v4;

module.exports = class Util {

  static template(template, params) {
    return new Function(...Object.keys(params), `return \`${template}\``)(...Object.values(params));
  }

  static uuid() {
    return UUID();
  }

  static copy(value) {
    return JSON.parse(JSON.stringify(value));
  }

  /**
   * @param {Object} object 
   * @returns {*}
   */
  static getValue(object, index = 0) {
    const keys = Object.keys(object);
    return object[keys[index]] ?? null;
  }

  /**
   * @param {Object} object 
   * @returns {*}
   */
  static getIndex(object, index = 0) {
    const keys = Object.keys(object);
    return keys[index] ?? null;
  }

  /**
   * @param {Object} object 
   * @param {*} key 
   * @returns {number}
   */
  static getIndexKey(object, key) {
    const keys = Object.keys(object);
    return keys.findIndex(v => v === key);
  }

  static getObjectLength(object) {
    return Object.keys(object).length;
  }

  /**
   * @param {string} string 
   * @returns {string}
   */
  static ucFirst(string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1);
  }

  /**
   * @param {mixed[]} array 
   * @returns {mixed[]}
   */
  static shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  /**
   * @param {Array} array 
   * @param {CallableFunction} predicate
   * @param {Object}
   */
  static omap(array, predicate) {
    const object = {};
    for (const index in array) {
      const result = predicate(array[index], index, array);
      if (Array.isArray(result) && result.length > 1) {
        object[result[0]] = result[1];
      }
    }
    return object;
  }

}
