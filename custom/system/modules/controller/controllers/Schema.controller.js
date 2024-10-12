const SystemCollector = require('zero-system/src/SystemCollector');
const Request = require('../Request');

module.exports = class SchemaController {

  static get id() { return 'schema' }

  /**
   * @param {import('zero-system/src/ControllerCollector')} collector
   */
  static define(collector) {
    // entity
    collector
      .addRoute('list.entity', 'schema/list/entity', 'listEntity')
      .setAttribute('method', 'get');

    collector
      .addRoute('get.entity', 'schema/entity/:id', 'getEntity')
      .setAttribute('method', 'get');

    collector
      .addRoute('post.entity', 'schema/entity/:id', 'postEntity');

    collector
      .addRoute('delete.entity', 'schema/entity/:id', 'deleteEntity')
      .setAttribute('method', 'delete');

    collector
      .addRoute('patch.entity', 'schema/entity/:id', 'patchEntity')
      .setAttribute('method', 'patch');

    // fieldmap
    collector
      .addRoute('list.fieldmap', 'schema/list/fieldmap', 'listFieldmap')
      .setAttribute('method', 'get');

    collector
      .addRoute('get.fieldmap', 'schema/fieldmap/:entity/:field', 'getFieldmap')
      .setAttribute('method', 'get');

    collector
      .addRoute('post.fieldmap', 'schema/fieldmap/:entity/:field', 'postFieldmap');

    collector
      .addRoute('delete.fieldmap', 'schema/fieldmap/:entity/:field', 'deleteFieldmap')
      .setAttribute('method', 'delete');

    collector
      .addRoute('patch.fieldmap', 'schema/fieldmap/:entity/:field', 'patchFieldmap')
      .setAttribute('method', 'patch');

    // field
    collector
      .addRoute('list.field', 'schema/list/field', 'listFieldDefinition')
      .setAttribute('method', 'get');

    collector
      .addRoute('get.field', 'schema/field/:id', 'getFieldDefinition')
      .setAttribute('method', 'get');

    collector
      .addRoute('post.field', 'schema/field/:id', 'postFieldDefinition');

    collector
      .addRoute('delete.field', 'schema/field/:id', 'deleteFieldDefinition')
      .setAttribute('method', 'delete');

    collector
      .addRoute('patch.field', 'schema/field/:id', 'patchFieldDefinition')
      .setAttribute('method', 'patch');

    collector
      .addRoute('model.schema', 'schema/model', 'modelSchema')
      .setAttribute('method', 'get');

    collector
      .addRoute('model.load', 'schema/model/load', 'modelLoad')
      .setAttribute('method', 'get');

    collector
      .addRoute('model.load.multi', 'schema/model/multi', 'modelMulti')
      .setAttribute('method', 'get');

    collector
      .addRoute('model.delete', 'schema/model/delete', 'modelDelete');
    
    collector
      .addRoute('model.save', 'schema/model/save', 'modelSave');

    collector
      .addRoute('test', 'schema/test');
  }

  constructor() {
    /** @type {import('../Storage')} */
    this.storage = SystemCollector.get('storage');
    /** @type {import('../Models')} */
    this.models = SystemCollector.get('models');
  }

  /**
   * @param {import('../Request')} request 
   */
  async test(request) {
    const output = {};

    const entity = await this.storage.load(1);
    output.entity = entity.data;
    entity.setValue('text', 'cool');
    output.newEntity = (await this.storage.save(entity)).data;

    request.setResponse(output);
  }

  /**
   * @param {import('../Request')} request 
   */
  async listEntity(request) {
    const entities = await this.storage.getEntityDefinition();

    request.setResponse({
      list: entities.map(v => { 
        return { 
          id: v.id,
          label: v.label,
        };
      }),
    });
  }

  /**
   * @param {import('../Request')} request
   */
  async listFieldmap(request) {
    const fieldmaps = await this.storage.getFieldMap();
    let fieldtypes = [];
    if (request.GET.load) {
      fieldtypes = await this.storage.getFieldDefinition();
    }
    
    request.setResponse({
      list: fieldmaps.map(v => {
        const item = { 
          id: v.id,
          label: v.label,
          entity: v.entity,
          field: v.field,
        };
        if (request.GET.load) {
          item.definition = fieldtypes.find(ft => ft.id === v.field);
        }
        return item;
      }).filter(v => {
        if (request.GET.entity && request.GET.entity !== v.entity) return false;
        if (request.GET.field && request.GET.field !== v.field) return false;
        return true;
      }),
    });
  }

  /**
   * @param {import('../Request')} request
   */
  async listFieldDefinition(request) {
    const fielddefinition = await this.storage.getFieldDefinition();

    request.setResponse({
      list: fielddefinition.map(v => { 
        return {
          id: v.id, 
          label: v.label, 
          type: v.type, 
        };
      }),
    });
  }

  /**
   * @param {import('../Request')} request 
   */
  async getEntity(request) {
    const definitions = await this.storage.getDefinitions();
    const definition = definitions.find(v => v.getEntity().id === request.ROUTE.id);

    if (!definition) {
      request.setError(Request.ERROR_NOT_FOUND, `The entity type ${request.ROUTE.id} don't exist.`);
      return;
    } 

    request.setResponse(
      definition.definition,
    );
  }

  /**
   * @param {import('../Request')} request 
   */
  async postEntity(request) {
    if (await this.storage.getEntityDefinition(request.GET.id)) {
      request.setError(Request.ERROR_ALREADY_EXIST, `The entity type ${request.GET.id} already exist.`);
      return;
    }
    request.setResponse({
      result: true,
      type: `entity.create.${request.GET.id}`,
      create: await this.storage.createEntityDefinition(request.extract({
        get: { id: null },
        post: { label: null, settings: {} },
      })),
    });
  }

  /**
   * @param {import('../Request')} request 
   */
  async deleteEntity(request) {
    request.setResponse({
      result: true,
      type: `entity.delete.${request.GET.id}`,
      delete: await this.storage.deleteEntityDefinition(request.extract({
        get: { id: null },
      })),
    });
  }

  /**
   * @param {import('../Request')} request 
   */
  async patchEntity(request) {
    const definition = await this.storage.getEntityDefinition(request.GET.id);

    if (!definition) {
      request.setError(Request.ERROR_NOT_FOUND, `The entity type ${request.GET.id} don't exist.`);
      return;
    }

    request.setResponse({
      result: true,
      type: `entity.update.${request.GET.id}`,
      update: await this.storage.updateEntityDefinition(request.extract({
        get: { id: null },
        post: { label: null, settings: {} },
      })),
    });
  }

  /**
   * @param {import('../Request')} request 
   */
  async getFieldmap(request) {
    const definition = await this.storage.getFieldMap(`${request.ROUTE.entity}__${request.ROUTE.field}`);

    if (!definition) {
      request.setError(Request.ERROR_NOT_FOUND, `The fieldmap ${request.ROUTE.entity}__${request.ROUTE.field} don't exist.`);
      return;
    } 

    request.setResponse(
      definition,
    );
  }

  /**
   * @param {import('../Request')} request 
   */
  async postFieldmap(request) {
    if (await this.storage.getFieldMap(`${request.GET.entity}__${request.GET.field}`)) {
      request.setError(Request.ERROR_ALREADY_EXIST, `The fieldmap ${request.GET.entity}__${request.GET.field} already exist.`);
      return;
    }
    const fielddefinition = await this.storage.getFieldDefinition(request.GET.field);
    if (!fielddefinition) {
      request.setError(Request.ERROR_NOT_FOUND, `The field definition ${request.GET.field} don't exist.`);
      return;
    }

    request.setResponse({
      result: true,
      type: `fieldmap.create.${request.GET.entity}__${request.GET.field}`,
      create: await this.storage.createFieldMap(request.extract({
        get: { entity: null, field: null },
        post: { label: fielddefinition.label, settings: {} },
      })),
    });
  }

  /**
   * @param {import('../Request')} request 
   */
  async deleteFieldmap(request) {
    request.setResponse({
      result: true,
      type: `fieldmap.delete.${request.GET.entity}__${request.GET.field}`,
      delete: await this.storage.deleteFieldMap(request.extract({
        get: { entity: null, field: null },
      })),
    });
  }

  /**
   * @param {import('../Request')} request 
   */
  async patchFieldmap(request) {
    const definition = await this.storage.getFieldMap(`${request.GET.entity}__${request.GET.field}`);

    if (!definition) {
      request.setError(Request.ERROR_NOT_FOUND, `The fieldmap ${request.GET.entity}__${request.GET.field} don't exist.`);
      return;
    }

    request.setResponse({
      result: true,
      type: `fieldmap.update.${request.GET.entity}__${request.GET.field}`,
      update: await this.storage.updateFieldMap(request.extract({
        get: { entity: null, field: null },
        post: { label: null, settings: {} },
      })),
    });
  }

  /**
   * @param {import('../Request')} request 
   */
  async getFieldDefinition(request) {
    const definition = await this.storage.getFieldDefinition(request.GET.id);

    if (!definition) {
      request.setError(Request.ERROR_NOT_FOUND, `The field ${request.GET.id} don't exist.`);
      return;
    } 

    request.setResponse(
      definition,
    );
  }

  /**
   * @param {import('../Request')} request 
   */
  async postFieldDefinition(request) {
    if (await this.storage.getFieldDefinition(request.GET.id)) {
      request.setError(Request.ERROR_ALREADY_EXIST, `The field ${request.GET.id} already exist.`);
      return;
    }

    request.setResponse({
      result: true,
      type: `field.create.${request.GET.id}`,
      create: await this.storage.createFieldDefinition(request.extract({
        get: { id: null },
        post: { label: null, type: null, settings: {} },
      })),
    });
  }

  /**
   * @param {import('../Request')} request 
   */
  async deleteFieldDefinition(request) {
    request.setResponse({
      result: true,
      type: `field.delete.${request.GET.id}`,
      delete: await this.storage.deleteFieldDefinition(request.extract({
        get: { id: null },
      })),
    });
  }

  /**
   * @param {import('../Request')} request 
   */
  async patchFieldDefinition(request) {
    const definition = await this.storage.getFieldDefinition(request.GET.id);

    if (!definition) {
      request.setError(Request.ERROR_NOT_FOUND, `The field ${request.GET.id} don't exist.`);
      return;
    }

    request.setResponse({
      result: true,
      type: `field.update.${request.GET.id}`,
      update: await this.storage.updateFieldDefinition(request.extract({
        get: { id: null },
        post: { label: null, settings: null },
      })),
    });
  }

  /**
   * @param {import('../Request')} request 
   */
  async modelSchema(request) {
    try {
      const model = this.models.getSchema(request.GET.model);
      request.setResponse({ model });
    } catch (e) {
      console.log('DEMO: ' + e.message, e);
      request.debug();
    }
  }

  /**
   * @param {import('../Request')} request 
   */
  async modelLoad(request) {
    try {
      const model = await this.storage.database[request.GET.model].findFirst({
        where: JSON.parse(request.GET.where),
      });
      if (model) {
        this.unpackModel(request.GET.model, model);
      }
      request.setResponse({ model });
    } catch (e) {
      console.log('DEMO: ' + e.message, e);
      request.debug();
    }
  }

  /**
   * @param {import('../Request')} request 
   */
  async modelMulti(request) {
    try {
      const models = await this.storage.database[request.GET.model].findMany({
        where: JSON.parse(request.GET.where),
      });
      for (const model of models) {
        this.unpackModel(request.GET.model, model);
      }
      request.setResponse({ models });
    } catch (e) {
      console.log('DEMO: ' + e.message, e);
      request.debug();
    }
  }

  unpackModel(type, model) {
    for (const field of this.models.getSchemaFieldsByType(type, 'Json')) {
      model[field.name] = JSON.parse(model[field.name] ?? '{}');
    }
  } 

  packModel(type, model) {
    for (const field of this.models.getSchemaFieldsByType(type, 'Json')) {
      if (model[field.name] !== undefined && model[field.name] !== null) {
        model[field.name] = JSON.stringify(model[field.name]);
      }
    }
  }

  /**
   * @param {import('../Request')} request 
   */
  async modelDelete(request) {
    try {
      const result = await this.storage.database[request.POST.model].deleteMany({
        where: request.POST.where,
      });

      request.setResponse({ result });
    } catch (e) {
      console.log('DEMO: ' + e.message, e);
      request.debug();
    }
  }

  /**
   * @param {import('../Request')} request 
   */
  async modelSave(request) {
    try {
      let model = null;
      const data = request.POST.data;

      this.packModel(request.POST.model, data);

      if (request.POST.isNew) {
        model = await this.storage.database[request.POST.model].create({
          data,
        });
      } else {
        const where = {};
        for (const field of this.models.getSchemaPrimaryFields(request.POST.model)) {
          where[field.name] = data[field.name];
        }
        model = await this.storage.database[request.POST.model].update({
          where,
          data,
        });
      }

      this.unpackModel(request.POST.model, model);
     
      request.setResponse({ model });
    } catch (e) {
      console.log('DEMO: ' + e.message, e);
      request.debug();
    }
  }

}