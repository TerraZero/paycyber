module.exports = class Request {

  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.sended = false;
    this.response = {};
  }

  /**
   * @returns {Object}
   */
  getBody() {
    return this.req.body;
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

}