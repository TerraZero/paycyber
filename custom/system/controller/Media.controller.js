module.exports = class MediaController {

  static get id() { return 'media' }

  /**
   * @param {import('zero-system/src/ControllerCollector')} collection
   */
  static define(collection) {
    collection.addRoute('create', 'media/create');
  }

  create(request) {

  }

}