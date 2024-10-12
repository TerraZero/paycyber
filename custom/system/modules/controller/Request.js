module.exports = class Request {

  static get ERROR_UNKNOWN() { return 'error.unknown' };
  static get ERROR_NOT_FOUND() { return 'error.not_found' };
  static get ERROR_ALREADY_EXIST() { return 'error.entity.already_exist' };

  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.sended = false;
    this.response = {};
  }

  /** @returns {Object<string, any>} */
  get POST() {
    return this.getBody();
  }

  /** @returns {Object<string, any>} */
  get DELETE() {
    return this.POST;
  }

  /** @returns {Object<string, any>} */
  get ROUTE() {
    return this.getParams();
  }

  /** @returns {Object<string, any>} */
  get GET() {
    return this.req.query;
  }

  /** @returns {string} */
  get path() {
    return this.req.path;
  }

  /** @returns {string} */
  get method() {
    return this.req.method;
  }

  /**
   * @returns {Object}
   */
  getBody() {
    return this.req.body;
  }

  /**
   * @returns {Object}
   */
  getParams() {
    return this.req.params;
  }

  /**
   * @param {string} type 
   * @param {string} message 
   * @param {Error} error
   */
  setError(type, message, error) {
    this.setResponse({
      error: {
        type,
        message,
        trace: error?.stack?.split('\n').map(v => v.trim()),
      },
    });
    return this;
  }

  setResponse(response) {
    this.response = response;
    return this;
  }

  async send() {
    if (this.sended) throw new Error('The request is already executed.');
    await this.res.send(this.response);
    this.sended = true;
  }

  extract(definition) {
    const object = {};

    for (const container in definition) {
      for (const field in definition[container]) {
        object[field] = this[container.toUpperCase()][field] ?? definition[container][field];
      }
    }
    return object;
  }

  debug() {
    console.log('DEBUG REQUEST ###');
    console.log('PATH:', this.path);
    console.log('METHOD:', this.method);
    console.log('ROUTE:', this.ROUTE);
    console.log('GET:', this.GET);
    console.log('POST:', this.POST);
    console.log('### DEBUG REQUEST');
  }

}