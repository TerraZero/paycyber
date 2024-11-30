const JukeBox = require('../custom/frontend/util/JukeBox');

const juke = new JukeBox();
// const items = ['a', 'b', 'c', 'd'];
const items = {
  a: 'al',
  b: 'bl',
  c: 'cl',
}

juke.setLoop().setShuffle().setItems(items);

for (let i = 0; i < 8; i++) {
  console.log(juke.next(), juke.key());
}