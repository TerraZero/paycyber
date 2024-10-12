const ButtonField = require('./Button.formfield');

module.exports = class SubmitField extends ButtonField {

  /**
   * @param {import('../collectors/FormFieldCollector')} collector 
   */
  static define(collector) {
    collector.add('submit');
  }

  setDefault() {
    super.setDefault();
    this.schema.action = 'submit';
  }

}