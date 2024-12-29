export default class EntityStorageBase {

  /**
   * @param {import('./EntityBase').default} entity 
   */
  async save(entity) {

  }

  /**
   * @param {string} type
   * @param {Object} props
   * @returns {import('./EntityBase').default}
   */
  async load(type, props = {}) {  

  }

  /**
   * @param {string} type
   * @param {Object} props
   * @returns {import('./EntityBase').default[]}
   */
  async loadMultiple(type, props = {}) {

  }

}