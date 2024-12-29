class ServiceTest {

  async hallo() {
    console.log('hallo');
  }

}

class ProxyService {

  static create(service) {
    return new Proxy({}, {

      get(target, prop, receiver) {
        return async (...args) => {
          return service[prop](...args);
        };
      },

    });
  }

}

(async () => {

  /** @type ServiceTest */
  const test = ProxyService.create(new ServiceTest());

  await test.hallo();

})();