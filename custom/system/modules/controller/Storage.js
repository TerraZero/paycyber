const Definition = require('./Definition');

module.exports = class Storage {

  /**
   * @param {import('@prisma/client').PrismaClient} prisma
   */
  constructor(prisma) {
    this.prisma = prisma;
    this.entity_definitions = null;
    this.field_definitions = null;
    this.field_maps = null;
    this.definitions = null;
    this.transaction = null;
  }

  async inTransaction(callback) {
    if (this.transaction === null) {
      return await this.prisma.$transaction(async (transaction) => {
        this.transaction = transaction;
        const result = await callback();
        this.transaction = null;
        return result;
      });
    } else {
      return await callback();
    }
  }

  async getEntityDefinition(id = null) {
    if (this.entity_definitions === null) {
      this.entity_definitions = (await (this.transaction || this.prisma).entityDefinition.findMany()).map(v => {
        v.settings = JSON.parse(v.settings);
        return v;
      });
    }
    if (id === null) {
      return this.entity_definitions;
    } else {
      return this.entity_definitions.find(v => v.id === id) ?? null;
    }
  }

  async getFieldDefinition(id = null) {
    if (this.field_definitions === null) {
      this.field_definitions = (await (this.transaction || this.prisma).fieldDefinition.findMany()).map(v => {
        v.settings = JSON.parse(v.settings);
        return v;
      });
    }
    if (id === null) {
      return this.field_definitions;
    } else {
      return this.field_definitions.find(v => v.id === id) ?? null;
    }
  }

  /**
   * @param {string} id 
   * @returns {(Promise<Definition.T_FieldMap>|Promise<Definition.T_FieldMap[]>)}
   */
  async getFieldMap(id = null) {
    if (this.field_maps === null) {
      this.field_maps = (await (this.transaction || this.prisma).fieldMap.findMany()).map(v => {
        v.settings = JSON.parse(v.settings);
        return v;
      });
    }
    if (id === null) {
      return this.field_maps;
    } else {
      return this.field_maps.find(v => v.id === id) ?? null;
    }
  }

  /**
   * @returns {Promise<Definition[]>}
   */
  async getDefinitions() {
    if (this.definitions === null) {
      this.definitions = [];
      const entities = await this.getEntityDefinition();
      const fieldmap = await this.getFieldMap();
      const fields = await this.getFieldDefinition();

      for (const entity of entities) {
        const definition = JSON.parse(JSON.stringify(entity));
        definition.fields = [];
        for (const map of fieldmap) {
          if (map.entitydefinition_id !== entity.id) continue;
          const fielddef = JSON.parse(JSON.stringify(map));
          fielddef.storage = JSON.parse(JSON.stringify(fields.find(v => v.id === map.fielddefinition_id)));
          definition.fields.push(fielddef);
        }
        this.definitions.push(new Definition(this, definition));
      }
    }
    return this.definitions;
  }

  async addEntityDefinition(id, label, settings = {}) {
    this.entity_definitions = null;
    this.definitions = null;
    return await (this.transaction || this.prisma).entityDefinition.create({
      data: {
        id,
        label,
        settings: JSON.stringify(settings),
      },
    });
  }

  async addFieldMap(entity, field, label, settings = {}) {
    this.field_maps = null;
    this.definitions = null;
    return await (this.transaction || this.prisma).fieldMap.create({
      data: {
        id: entity + '__' + field,
        label,
        settings: JSON.stringify(settings),
        entitydefinition_id: entity,
        fielddefinition_id: field,
      },
    });
  }

  async addFieldDefinition(id, label, type, settings = {}) {
    this.field_definitions = null;
    this.definitions = null;
    return await (this.transaction || this.prisma).fieldDefinition.create({
      data: {
        id,
        label,
        type,
        settings: JSON.stringify(settings),
      },
    });
  }

}