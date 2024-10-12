const SystemCollector = require('zero-system/src/SystemCollector');
const Menu = require('../Menu');

module.exports = class MenuController {

  static get id() { return 'menu' }

  /**
   * @param {import('zero-system/src/ControllerCollector')} collector
   */
  static define(collector) {
    collector
      .addRoute('menu', 'menu')
      .setAttribute('method', 'get');
  }

  /**
   * @param {import('../../controller/Request')} request 
   */
  async menu(request) {
    const menu = new Menu();

    await menu.create();
    
    request.setResponse({
      menu: menu.build(),
    });
  }

}
