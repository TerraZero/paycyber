const Yup = require('yup');

class Test {

  constructor() {
    this.rules = [];
  }

  rule(message) {
    const rule = {
      message,
      yup: Yup,
    };
    this.rules.push(rule);
    const proxy = new Proxy({}, {

      get(target, prop, receiver) {
        console.log('get', prop, typeof rule.yup[prop]);
        if (typeof rule.yup[prop] === 'function') {
          return (...args) => {
            console.log('call', prop, args);
            rule.yup = rule.yup[prop](...args);
            return proxy;
          };
        }
      },

    });
    return proxy;
  }

}

const t = new Test();

t.rule().string().required();
console.log(t.rules);