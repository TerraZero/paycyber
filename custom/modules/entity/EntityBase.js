export default class EntityBase {

  static onPrismaLoad() {

  }

  static onPrismaSave() {

  }

  /**
   * @param {Object} data 
   * @returns {Object}
   */
  static unpack(data) {
    return data;
  }

  /**
   * @param {Object} data 
   * @returns {Object}
   */
  static pack(data) {
    return data;
  }

  /**
   * @param {import('./EntityStorageBase').default} storage 
   * @param {Object} data
   */
  constructor(storage, data) {
    this.storage = storage;
    this.data = data;
  }

  /**
   * @returns {typeof EntityBase}
   */
  get def() {
    return this.constructor;
  }

  async save() {
    return await this.storage.save(this);
  }

  get type() {
    throw new Error(this.def.name + '.type is not implemented.');
  }

  get props() {
    return {};
  }
  
}