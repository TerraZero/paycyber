const FormBase = require('../../form/FormBase');
const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class EntityTypeForm extends FormBase {

  /**
   * @param {import('../collectors/FormCollector')} collector
   */
  static define(collector) {
    collector.add('entity.type');
  }

  init() {
    /** @type {import('../Storage')} */
    this.storage = SystemCollector.get('storage');
  }

  async prepare() {
    const type = this.form.getInfo('type');
    if (type) {
      const model = await this.storage.getEntityDefinition(this.form.getInfo('type'));
      this.setModel(model);
    }
  }

  /**
   * @param {import('../../form/formfields/Form.formfield')} form 
   */
  async build(form) {
    switch (form.getInfo('operation') ?? 'add') {
      case 'add':
        form.label('Create Entity Form');
        break;
      case 'edit':
        form.label(`Edit Entity "${await this.queryValue('label')}" Form`);
        break;
    }
    form
      .addField('string', 'id')
      .label('ID')
      .rule('Das ID Feld ist ein Pflichtfeld.').string().required();

    form
      .addField('string', 'label')
      .label('Label')
      .rule('Das Label Feld ist ein Pflichtfeld.').string().required();

    form
      .addField('actions', 'actions')
      .addField('submit', 'submit')
      .label('Submit');
  }

  async validate() {
    const entity = await this.storage.getEntityDefinition(await this.queryValue('id'));
    
    if (entity) {
      throw new Error(`Die ID ${await this.queryValue('id')} ist bereits vergeben.`);
    }
  }

  async submit() {
    const model = await this.getModel();

    try {
      await this.storage.createEntityDefinition({
        id: model.id,
        label: model.label,
      });
      this.setRedirect(`/admin/structure/${model.id}/edit`);
    } catch (e) {
      console.log(e);
    }
  }

}