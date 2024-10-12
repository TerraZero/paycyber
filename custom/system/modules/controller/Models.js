const Prisma = require('@prisma/client').Prisma;

module.exports = class Models {

  constructor() {
    this.schemas = null;
  }

  get models() {
    return Prisma.dmmf.datamodel.models;
  }

  getModel(table) {
    return this.models.find(v => v.name === table);
  }

  getModelField(table, field) {
    return this.getModel(table)?.fields.find(v => v.name === field);
  }

  getSchemas() {
    if (this.schemas === null) {
      this.schemas = this.models.map(model => {
        return {
          model: model,
          name: model.name,
          fields: model.fields.map(field => {
            return {
              model: field,
              name: field.name,
              type: field.dbName?.endsWith('_json') ? 'Json' : field.type,
              required: field.isRequired,
              primary: field.isId,
            };
          }),
        };
      });
    }
    return this.schemas;
  }

  getSchema(model) {
    return this.getSchemas().find(v => v.name === model);
  }

  getSchemaField(model, field) {
    return this.getSchema(model)?.fields.find(v => v.name === field);
  }

  getSchemaPrimaryFields(model) {
    return this.getSchema(model)?.fields.filter(v => v.primary);
  }

  getSchemaRequiredFields(model) {
    return this.getSchema(model)?.fields.filter(v => v.required);
  }

  getSchemaFieldsByType(model, type) {
    return this.getSchema(model)?.fields.filter(v => v.type === type);
  }

}