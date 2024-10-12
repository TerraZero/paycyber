const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class EntityEvent {

  /**
   * @param {import('../../utils/collectors/EventCollector')} collector
   */
  static define(collector) {
    collector.add('menu.event.entity');
  }

  constructor() {
    /** @type {import('../Storage')} */
    this.storage = SystemCollector.get('storage');
  }

  /**
   * @param {import('../../menu/Menu')} menu 
   */
  async menuCreate(menu) {
    const base = menu.addMenu('structure', 's-data');
    const op = base.addGroup('op', 'Operation');
      
    op.addItem('add', 'Add Entity Type', '/admin/structure/entity/add');

    const types = base.addGroup('types', 'Types');

    const entityTypes = await this.storage.getEntityDefinition();
    
    for (const entityType of entityTypes) {
      types
        .addItem(entityType.id, 'Edit ' + entityType.label, '/admin/structure/:entity/edit', { entity: entityType.id })
        .addOperation('edit', 'Edit', '/admin/structure/:entity/edit', { before: 'edit', title: 'Edit ' + entityType.label })
        .addOperation('fields', 'Fields', '/admin/structure/:entity/fields', { before: 'folder-opened', title: 'Edit Fields ' + entityType.label })
        .addOperation('delete', 'Delete', '/admin/structure/:entity/delete', { before: 'delete', title: 'Delete ' + entityType.label, type: 'danger' });
    }
  }

}
