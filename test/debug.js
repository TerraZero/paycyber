const Models = require('../custom/system/modules/controller/Models');

const m = new Models();

console.log(m.getModelField('Demo', 'id'));

console.log(m.getSchema('Demo'));
console.log(m.getSchemaField('Demo', 'value'));
