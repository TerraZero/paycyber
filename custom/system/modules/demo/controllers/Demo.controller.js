const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class DemoController {

  static get id() { return 'demo' }

  /**
   * @param {import('zero-system/src/ControllerCollector')} collector
   */
  static define(collector) {
    collector
      .addRoute('list', 'demo/list')
      .setAttribute('method', 'get');
    
    collector
      .addRoute('load', 'demo/:id/load')
      .setAttribute('method', 'get');
    
    collector
      .addRoute('loadMulti', 'demo/load-multi');

    collector
      .addRoute('loadProps', 'demo/load-props');

    collector
      .addRoute('save', 'demo/save');

    collector
      .addRoute('delete', 'demo/delete');

    collector
      .addRoute('groups', 'demo/list/groups')
      .setAttribute('method', 'get');

    collector
      .addRoute('state', 'demo/state');
  }

  constructor() {
    /** @type {import('../../controller/Storage')} */
    this.storage = SystemCollector.get('storage');
  }

  /**
   * @param {import('../../controller/Request')} request 
   */
  async list(request) {
    try {
      const query = {
        select: {
          id: true,
          type: true,
          label: true,
          group: true,
        },
      };

      if (request.GET.pager) {
        query.take = this.toInt(request.GET.pager);
        if (request.GET.page) {
          query.skip = query.take * this.toInt(request.GET.page);
        }
      }

      if (request.GET.search) {
        const fields = [];
        for (const field of ['type', 'label', 'group']) {
          fields.push({
            [field]: {
              contains: request.GET.search,
            },
          });
        }
        query.where = {
          OR: fields,
        };
      }
      if (request.GET.type) {
        query.where ??= {};
        query.where.type = request.GET.type;
      }

      const list = await this.storage.database.demo.findMany(query);
      const count = await this.storage.database.demo.count({ where: query.where });

      request.setResponse({ list, count });
    } catch (e) {
      console.log('DEMO: ' + e.message, e);
      request.debug();
    }
  }

  /**
   * @param {import('../../controller/Request')} request 
   */
  async groups(request) {
    try {
      const list = await this.storage.database.demo.groupBy({
        by: ['group'],
        select: {
          group: true,
        },
      });

      const groups = [];
      for (const item of list) {
        groups.push(item.group);
      }
      request.setResponse({ groups });
    } catch (e) {
      console.log('DEMO: ' + e.message, e);
      request.debug();
    }
  }

  /**
   * @param {import('../../controller/Request')} request 
   */
  async load(request) {
    try {
      const item = await this.storage.database.demo.findFirst({
        where: {
          id: this.toInt(request.ROUTE.id),
        }
      });
      if (item) {
        item.value = JSON.parse(item.value ?? '{}');
      }
      request.setResponse({ item });
    } catch (e) {
      console.log('DEMO: ' + e.message, e);
      request.debug();
    }
  }

  /**
   * @param {import('../../controller/Request')} request 
   */
  async loadMulti(request) {
    try {
      const items = await this.storage.database.demo.findMany({
        where: {
          id: { in: request.POST.ids.map(this.toInt) },
        }
      });
      for (const index in items) {
        items[index].value = JSON.parse(items[index].value ?? '{}');
      }
      request.setResponse({ items });
    } catch (e) {
      console.log('DEMO: ' + e.message, e);
      request.debug();
    }
  }

  /**
   * @param {import('../../controller/Request')} request 
   */
  async loadProps(request) {
    try {
      const items = await this.storage.database.demo.findMany({
        where: request.POST.where,
      });
      for (const index in items) {
        items[index].value = JSON.parse(items[index].value ?? '{}');
      }
      request.setResponse({ items });
    } catch (e) {
      console.log('DEMO: ' + e.message, e);
      request.debug();
    }
  }

  /**
   * @param {import('../../controller/Request')} request 
   */
  async save(request) {
    try {
      const response = { };
      const entity = request.POST.entity;

      entity.value = JSON.stringify(entity.value ?? '{}');
      
      if (entity.id) {  
        response.entity = await this.storage.database.demo.update({
          where: {  
            id: entity.id,
          },
          data: entity,
        });
        response.mode = 'update';
      } else {
        response.entity = await this.storage.database.demo.create({
          data: entity,
        });
        response.mode = 'create';
      }

      await this.addLog('demo.controller.save', `${entity.type}:${entity.group}`, 'Save', entity);
      response.entity.value = JSON.parse(response.entity.value ?? '{}');
      request.setResponse(response);
    } catch (e) {
      console.log('DEMO: ' + e.message, e);
      request.debug();
    }
  }

  /**
   * @param {import('../../controller/Request')} request 
   */
  async delete(request) {
    try {
      const response = await this.storage.database.demo.delete({
        where: {
          id: this.toInt(request.POST.id),
        },
      });
      request.setResponse(response);
    } catch (e) {
      console.log('DEMO: ' + e.message, e);
      request.debug();
    }
  }

  /**
   * @param {import('../../controller/Request')} request 
   */
  async state(request) {
    try {
      let response = null;
      switch (request.POST.op) {
        case 'save':
          response = await this.storage.inTransaction(async tx => {
            const responses = [];
            for (const state of request.POST.states) {
              const value = JSON.stringify(state.value);
              responses.push(await tx.demoState.upsert({
                where: {
                  key: state.key,
                },
                update: {
                  tag: state.tag ?? 'default',
                  value,
                },
                create: {
                  key: state.key,
                  tag: state.tag ?? 'default',
                  value,
                },
              }));
            }
            return responses;
          });
          break;
        case 'delete':
          response = await this.storage.database.demoState.deleteMany({
            where: {
              key: { in: request.POST.states },
            },
          });
          break;
        case 'list':
          response = await this.storage.database.demoState.findMany();
          for (const index in response) {
            response[index].value = JSON.parse(response[index].value);
          }
          break;
        case 'reset':
          response = await this.storage.database.demoState.deleteMany();
          break;
      }
      request.setResponse({ [request.POST.op]: response });
    } catch (e) {
      console.log('DEMO: ' + e.message, e);
      request.debug();
    }
  }

  /**
   * @param {string} field 
   * @param {any} fallback 
   * @param {boolean} check 
   * @returns {Number}
   */
  toInt(value) {
    if (value === null) return null;
    const parsed = Number.parseInt(value);
    if (value + '' !== parsed + '') {
      throw new Error(`Is no int.`);
    }
    return parsed;
  }

  /**
   * @param {string} trigger 
   * @param {string} subject 
   * @param {string} message 
   * @param {*} value 
   */
  async addLog(trigger, subject, message, value = {}) {
    return await this.storage.database.demoHistory.create({
      data: {
        trigger,
        subject,
        message,
        value: JSON.stringify(value),
      },
    });
  }

}
