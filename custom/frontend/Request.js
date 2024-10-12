const Path = require('path');
const DeepData = require('utils/src/DeepData');

module.exports = class Request {

  /**
   * @param {import('@nuxtjs/axios')} value
   */
  static set axios(value) {
    this._settings ??= {};
    this._settings.axios = value;
    this._settings.api = '/api/';
  }

  /** @returns {import('@nuxtjs/axios')} */
  static get axios() {
    return this._settings.axios;
  }

  static create(path) {
    return new Request(this._settings, path);
  }

  constructor(settings, path) {
    this.settings = settings;
    this.path = path;
    this.options = {};
    this.config = {};
    this.response = null;
  }

  deep(deep) {
    this.config.deep = deep;
    return this;
  }

  query(query = {}) {
    this.options.params = query;
    return this;
  }

  async GET(query = null) {
    if (query) {
      this.query(query);
    }
    this.setResponse(await this.constructor.axios.$get(Path.join(this.settings.api, this.path), this.options));
    return this.getResponse();
  }

  async POST(data) {
    this.setResponse(await this.constructor.axios.$post(Path.join(this.settings.api, this.path), data));
    return this.getResponse();
  }

  async DELETE(params) {
    this.setResponse(await this.constructor.axios.$delete(Path.join(this.settings.api, this.path), { params }));
    return this.getResponse();
  }

  setResponse(response) {
    this.response = response;
    return this;
  }

  getResponse() {
    if (this.config.deep) {
      return DeepData.getDeep(this.response, this.config.deep, null);
    }
    return this.response;
  }

}