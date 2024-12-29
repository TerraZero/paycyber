import SystemCollector from 'zero-system/src/SystemCollector';

export default class EntityCollector extends SystemCollector {

  /**
   * @param {string} path 
   */
  constructor(path = 'entity') {
    super('entity', path, '**/*.entity.js');
  }

  /**
   * @param {string} name 
   * @param {string} label
   * @returns {SystemItem}
   */
  add(name, label) {
    return super.add(name)
      .setAttribute('type', name)
      .setAttribute('label', label);
  }

}