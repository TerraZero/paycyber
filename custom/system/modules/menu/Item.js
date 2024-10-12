const UrlPattern = require('url-pattern');

module.exports = class Item {

  constructor(key, label, url, params = {}) {
    this.key = key;
    this.label = label;
    this.url = url;
    this.params = params;
    this.operations = {};
  }

  build() {
    return {
      title: this.label,
      url: this.url,
      params: this.params,
      path: (new UrlPattern(this.url)).stringify(this.params),
      operations: this.operations,
    };
  }

  addOperation(id, label, url, object = {}) {
    object.id = id;
    object.label = label;
    object.url = url;
    object.path = (new UrlPattern(url)).stringify(this.params);
    this.operations[id] = object;
    return this;
  }

}
