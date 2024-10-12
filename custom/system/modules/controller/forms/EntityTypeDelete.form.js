const FormBase = require('../../form/FormBase');
const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class EntityTypeForm extends FormBase {

  /**
   * @param {import('../collectors/FormCollector')} collector
   */
  static define(collector) {
    collector.add('entity.type.delete');
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
    form.label('Delete the entity type ' + this.getModel().label);

    form
      .addField('message', 'message')
      .setType('danger')
      .setMessage('Durch das löschen dieses entity types werden auch alle entities von diesem typ gelöscht.');


    form
      .addField('actions', 'actions')
      .addField('submit', 'submit')
      .label('Delete');
  }

  async submit() {
    try {
      await this.storage.deleteEntityDefinition({
        id: this.form.getInfo('type'),
      });
      console.log('redirect');
      this.setRedirect('/admin/structure/entity/add');
    } catch (e) {
      console.log(e);
    }
  }

}