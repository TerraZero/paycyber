const config = {};

export default class MasterConfig {

  static get config() {
    return config;
  }

  static get(field) {
    const parts = field.split('.');
    let local = this.config;
    for (const part of parts) {
      if (local[part] !== undefined && local[part] !== null) {
        local = local[part];
      } else {
        return null;
      }
    }
    return local ?? null;
  }

  static set(field, value) {
    const parts = field.split('.');
    let local = this.config;
    const last = parts.shift();
    for (const part of parts) {
      if (local[part] === undefined) {
        local[part] = {};
      }
      local = local[part];
    }
    local[last] = value;
    return this;
  }

  static setDefault(field, value) {
    if (this.get(field) === null) {
      this.set(field, value);
    }
    return this;
  }

}