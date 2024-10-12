const ActiveEntity = require('../system/modules/controller/ActiveEntity');
const Request = require('./Request');

module.exports = class RequestDemo extends Request {

  /**
   * @param {string} trigger 
   * @param {string} subject 
   * @param {Object} value 
   * @returns {ActiveEntity}
   */
  static async addLog(trigger, subject, message, value = {}) {
    const entity = new ActiveEntity('DemoHistory', {
      trigger, 
      subject,
      message,
      value,
    });
    await entity.doSave();
    return entity;
  }

}