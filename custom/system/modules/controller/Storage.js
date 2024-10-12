const SystemCollector = require('zero-system/src/SystemCollector');
const Definition = require('./Definition');
const Entity = require('./Entity');

/**
 * @typedef {Object} T_FieldMap
 * @property {string} [id]
 * @property {string} [entity]
 * @property {string} [field]
 * @property {string} [label]
 * @property {Object} [settings]
 */

/**
 * @typedef {Object} T_FieldDefinition
 * @property {string} [id]
 * @property {string} [type]
 * @property {string} [label]
 * @property {number} [length]
 * @property {Object} [settings]
 */

/**
 * @typedef {Object} T_EntityDefinition
 * @property {string} [id]
 * @property {string} [type]
 * @property {string} [label]
 * @property {Object} [settings]
 */

/**
 * @typedef {Object} T_BaseUpdate
 * @property {string} id
 * @property {string} [label]
 * @property {Object} [settings]
 */

/**
 * @typedef {function(import('@prisma/client').PrismaClient)} transactionCallback
 */

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
    this.table_info = {};
  }

  /** @returns {import('@prisma/client').PrismaClient} */
  get database() {
    return (this.transaction || this.prisma);
  }

  /**
   * @param {transactionCallback} callback 
   * @returns 
   */
  async inTransaction(callback) {
    if (this.transaction === null) {
      return await this.prisma.$transaction(async (transaction) => {
        this.transaction = transaction;
        const result = await callback(this.transaction);
        this.transaction = null;
        return result;
      });
    } else {
      return await callback(this.transaction);
    }
  }

  async getEntityDefinition(id = null) {
    if (this.entity_definitions === null) {
      this.entity_definitions = (await this.database.entityDefinition.findMany()).map(v => {
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
      this.field_definitions = (await this.database.fieldDefinition.findMany())
      
      for (const index in this.field_definitions) {
        this.field_definitions[index].settings = JSON.parse(this.field_definitions[index].settings);
        const fieldtype = this.getFieldType(this.field_definitions[index].type);
        this.field_definitions[index] = await fieldtype.viewFieldDefinition(this.field_definitions[index]);
      }
    }
    if (id === null) {
      return this.field_definitions;
    } else {
      return this.field_definitions.find(v => v.id === id) ?? null;
    }
  }

  async getFieldMap(id = null) {
    if (this.field_maps === null) {
      this.field_maps = (await this.database.fieldMap.findMany());

      for (const index in this.field_maps) {
        this.field_maps[index].settings = JSON.parse(this.field_maps[index].settings);
        const fieldtype = await this.findFieldType(this.field_maps[index].field);
        this.field_maps[index] = await fieldtype.viewFieldMap(this.field_maps[index]);
      }
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
          if (map.entity !== entity.id) continue;
          const fielddef = JSON.parse(JSON.stringify(map));
          fielddef.storage = JSON.parse(JSON.stringify(fields.find(v => v.id === map.field)));
          definition.fields.push(fielddef);
        }
        this.definitions.push(new Definition(this, definition));
      }
    }
    return this.definitions;
  }

  /**
   * @param {T_EntityDefinition} definition 
   * @returns 
   */
  async createEntityDefinition(definition) {
    this.entity_definitions = null;
    this.definitions = null;
    return this.database.entityDefinition.create({
      data: {
        id: definition.id,
        label: definition.label,
        settings: JSON.stringify(definition.settings || {}),
      },
    });
  }

  /**
   * @param {T_EntityDefinition} definition 
   * @returns 
   */
  async updateEntityDefinition(definition) {
    const data = {};

    if (definition.label) data.label = definition.label;
    if (definition.settings) data.settings = JSON.stringify(definition.settings);

    this.entity_definitions = null;
    this.definitions = null;

    return this.database.entityDefinition.update({
      where: {
        id: definition.id,
      },
      data,
    });
  }

  /**
   * @param {T_EntityDefinition} definition 
   * @returns 
   */
  async deleteEntityDefinition(definition) {
    this.field_definitions = null;
    this.field_maps = null;
    this.entity_definitions = null;
    this.definitions = null;
    return this.inTransaction(async tx => {
      const result = {};

      const fieldmaps = await tx.fieldMap.findMany({
        where: {
          entity: definition.id,
        },
      });

      result.fieldmaps = [];
      for (const fieldmap of fieldmaps) {
        result.fieldmaps.push(await this.deleteFieldMap({
          entity: fieldmap.entity,
          field: fieldmap.field,
        }));
      }

      result.entity = await tx.entity.deleteMany({
        where: {
          type: definition.id,
        },
      });

      result.entitydefinition = await tx.entityDefinition.deleteMany({
        where: {
          id: definition.id,
        },
      });
      return result;
    });
  }

  /**
   * @param {T_FieldMap} definition 
   * @returns 
   */
  async createFieldMap(definition) {
    const fieldtype = await this.findFieldType(definition.field);
    if (fieldtype === null) throw new Error('No fieldtype found for field ' + definition.field);

    this.field_maps = null;
    this.definitions = null;

    return fieldtype.createFieldMap(definition);
  }

  /**
   * @param {T_FieldMap} definition 
   * @returns 
   */
  async updateFieldMap(definition) {
    const fieldtype = await this.findFieldType(definition.field);
    if (fieldtype === null) throw new Error('No fieldtype found for field ' + definition.field);

    this.field_maps = null;
    this.definitions = null;

    return fieldtype.updateFieldMap(definition);
  }

  /**
   * @param {T_FieldMapExtends} definition 
   * @returns 
   */
  async deleteFieldMap(definition) {
    this.field_maps = null;
    this.definitions = null;

    const fieldtype = await this.findFieldType(definition.field);
    if (fieldtype === null) throw new Error('No fieldtype found for field ' + definition.field);

    return fieldtype.deleteFieldMap(definition);
  }

  /**
   * @param {T_FieldDefinition} definition
   * @returns 
   */
  async createFieldDefinition(definition) {
    const fieldtype = this.getFieldType(definition.type);
    if (fieldtype === null) throw new Error('The field type ' + definition.type + ' is unknown.');

    this.field_definitions = null;
    this.definitions = null;

    return fieldtype.createFieldDefinition(definition);
  }

  /**
   * @param {T_FieldDefinition} definition 
   * @returns 
   */
  async updateFieldDefinition(definition) {
    const fieldtype = await this.findFieldType(definition.id);
    if (fieldtype === null) throw new Error('No fieldtype found for field ' + definition.id);

    this.field_definitions = null;
    this.definitions = null;

    return fieldtype.updateFieldDefinition(definition);
  }

  /**
   * @param {T_FieldDefinition} definition 
   * @returns 
   */
  async deleteFieldDefinition(definition) {
    const fieldtype = await this.findFieldType(definition.id);
    if (fieldtype === null) throw new Error('No fieldtype found for field ' + definition.id);

    this.field_definitions = null;
    this.field_maps = null;
    this.definitions = null;

    return fieldtype.deleteFieldDefinition(definition);
  }

  /**
   * @param {string} field
   * @returns {?import('./FieldTypeBase')}
   */
  async findFieldType(field) {
    const fielddefinition = await this.getFieldDefinition(field);

    return this.getFieldType(fielddefinition.type);
  }

  /**
   * @param {string} type 
   * @returns {?import('./FieldTypeBase')}
   */
  getFieldType(type) {
    return SystemCollector.get(`fieldtype.${type}`) ?? null;
  }

  /**
   * @param {(T_FieldMap|T_FieldDefinition)} definition 
   */
  async getFieldTypeFromDefinition(definition) {
    if (definition.type) {
      return this.getFieldType(definition.type);
    } else {
      return this.findFieldType(definition.field ?? definition.id);
    }
  }

  /**
   * @param {number} id 
   * @returns {Entity}
   */
  async load(id) {
    return this.inTransaction(async tx => {
      const data = await tx.entity.findFirst({
        where: {
          id,
        },
        include: {
          fields: {
            include: {
              fieldmap: {
                include: {
                  fielddefinition: true,
                },
              },
            },
          },
        },
      });
      const fields = data.fields;
      data.fields = {};
      for (const field of fields) {
        const fieldtype = this.getFieldType(field.fieldmap.fielddefinition.type);
  
        data.fields[field.fieldmap.field] ??= [];
        const value = await fieldtype.viewField(data, field.fieldmap.field, field, data.fields[field.fieldmap.field]);
  
        if (value === null) continue;
        if (fieldtype.isMultipleField()) {
          data.fields[field.fieldmap.field] = value;
        } else {
          data.fields[field.fieldmap.field].push(value);
        }
      }
      return new Entity((await this.getDefinitions()).find(v => v.id === data.type), data);
    });
  }

  /**
   * @param {Entity} entity 
   * @returns {Entity}
   */
  async save(entity) {
    return this.inTransaction(async tx => {
      let entity_result = null;
      if (entity.data.id === null) {
        entity_result = await tx.entity.create({
          data: {
            label: entity.label,
            type: entity.type,
          },
        });
      } else {
        entity_result = await tx.entity.update({
          where: {
            id: entity.id,
          },
          data: {
            label: entity.label,
          },
        });
      }

      for (const field in entity.data.fields) {
        const fieldtype = await this.findFieldType(field);

        if (entity.id !== null) fieldtype.cleanField(entity, field);
        if (fieldtype.isMultipleField()) {
          fieldtype.updateField(entity, field, entity.data.fields[field], entity.data.fields[field]);
        } else {
          for (const value of entity.data.fields[field]) {
            fieldtype.updateField(entity, field, value, entity.data.fields[field]);
          }
        }
      }

      return await this.load(entity_result.id);
    });
  }

  /**
   * @param {string} table 
   * @property {Object}
   */
  async getSQLTableInfo(table) {
    if (this.table_info[table] !== undefined) return this.table_info[table];
    this.table_info[table] = { table, fields: {} };
    const columns = await this.prisma.$queryRaw`SELECT * FROM pragma_table_info(${table}) AS tblInfo;`;
    for (const column of columns) {
      this.table_info[table].fields[column.name] = {
        name: column.name,
        type: column.type.toLowerCase(),
        primary: column.pk === 1n,
      };
    }
    return this.table_info[table];
  }

}