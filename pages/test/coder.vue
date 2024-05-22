<template lang="pug">
.page
  .coder
    .coder__fields
      .coder__grid
        .coder__field(v-for="field in fields", :class="'coder__field--' + field")
    .coder__tray
      .coder__tray-card(v-for="item in tray") 
        CoderIcon(:card="item.card")
        .coder__tray-numbers
          .coder__tray-number {{ item.counts.first }}
          .coder__tray-number {{ item.counts.second }}
    .coder__control
      .coder__control-grid
        .coder__card(v-for="card in cards", @click="newTray(card)")
          CoderIcon(:card="card")
    .coder__form(v-if="form.id", :class="'coder__form--' + form.id")
      .coder__form-row
        CoderIcon.coder__form-subject(:card="form.card")
      .coder__form-row
        .coder__form-options
          .coder__form-option(v-for="item in 6", :class="getOptionClass('first', item)", @click="onSubmitOption('first', item)") {{ item }}
      .coder__form-row(v-if="form.card.count === 2")
        .coder__form-options
          .coder__form-option(v-for="item in 6", :class="getOptionClass('second', item)", @click="onSubmitOption('second', item)") {{ item }}
</template>

<script>
const paycyber = require('../../../cards/src/info/paycyber.json');

export default {
  data() {
    const fieldWidth = 6;
    const fields = [];
    
    for (let i = 0; i < fieldWidth * fieldWidth; i++) {
      fields.push(0);
    }

    return {
      fields,
      cards: paycyber.cards.filter(v => v.ui !== false),
      tray: [],
      form: {},
      pen: 1,
    };
  },
  methods: {
    addTray(item) {
      item.counts ||= {};
      this.tray.push(item);
      this.execute();
    },
    execute() {
      // reset
      for (const index in this.fields) {
        this.fields[index] = 0;
      }
      this.pen = 1;

      for (const index in this.tray) {
        const item = this.tray[index];

        if (item.card.field) {
          const field = this.transformCardFieldToArray(item.card.field);
          for (const index in field) {
            if (field[index] === 1) {
              this.fields[index] = this.pen;
            }
          }
        } else {
          switch (item.card.name.toLowerCase()) {
            case 'shift w':
              this.fields = Array.from({ length: 36 }, (_, i) => {
                if (i + item.counts.first * 6 < this.fields.length) {
                  return this.fields[i + item.counts.first * 6];
                } else {
                  return 0;
                }
              });
              break;
            case 'shift s':
              this.fields = Array.from({ length: 36 }, (_, i) => {
                if (i - item.counts.first * 6 >= 0) {
                  return this.fields[i - item.counts.first * 6];
                } else {
                  return 0;
                }
              });
              break;
            case 'shift a':
              this.fields = Array.from({ length: 36 }, (_, i) => {
                if (i % 6 + item.counts.first > 5) return 0;
                return this.fields[i % 6 + item.counts.first + Math.floor(i / 6) * 6];
              });
              break;
            case 'shift d':
              this.fields = Array.from({ length: 36 }, (_, i) => {
                if (i % 6 - item.counts.first < 0) return 0;
                return this.fields[i % 6 - item.counts.first + Math.floor(i / 6) * 6];
              });
              break;
            case 'rotate r':
              this.fields = Array.from({ length: 36 }, (_, i) => {
                const r = Math.floor(i / 6);
                const c = 5 - i % 6;
                return this.fields[c * 6 + r];
              });
              break;
            case 'rotate l':
              this.fields = Array.from({ length: 36 }, (_, i) => {
                const r = 5 - Math.floor(i / 6);
                const c = i % 6;
                return this.fields[r + c * 6];
              });
              break;
            case 'erase':
              this.pen = (this.pen === 1 ? 0 : 1);
              break;
            case 'pixel':
              this.fields[(item.counts.second - 1) * 6 + (item.counts.first - 1)] = this.pen;
              break;
            case 'mirror':
              this.fields = Array.from({ length: 36 }, (_, i) => {
                const r = Math.floor(i / 6);
                const c = i % 6;
                return this.fields[r * 6 + c] || this.fields[r * 6 + Math.abs(c - 5)];
              });
              break;
            case 'line h':
              this.fields = Array.from({ length: 36 }, (_, i) => {
                const r = Math.floor(i / 6);
                const c = i % 6;
                if (r + 1 === item.counts.first) {
                  return 1;
                } else {
                  return this.fields[r * 6 + c];
                }
              });
              break;
            case 'line v':
              this.fields = Array.from({ length: 36 }, (_, i) => {
                const r = Math.floor(i / 6);
                const c = i % 6;
                if (c + 1 === item.counts.first) {
                  return 1;
                } else {
                  return this.fields[r * 6 + c];
                }
              });
              break;
            case 'fill start':
              const end = this.findTray('fill end', index);
              if (end === null) break;
              const modifiers = this.getModifiers(index, end.index);
              const invert = modifiers.get('invert');
              const border = modifiers.get('border');
              this.fields = Array.from({ length: 36 }, (_, i) => {
                const r = Math.floor(i / 6);
                const c = i % 6;
                let cell = this.pen;
                if (invert) {
                  cell = this.fields[r * 6 + c] === 1 ? 0 : 1;
                }

                console.log(c, item.counts.first, end.item.counts.first);
                if (border && ((r === (item.counts.second - 1) || r === (end.item.counts.second - 1)) && (c >= (item.counts.first - 1) && c < end.item.counts.first) || 
                  (c === (item.counts.first - 1) || c === (end.item.counts.first - 1)) && (r >= (item.counts.second - 1) && r < end.item.counts.second))) {
                  return cell;
                } else if (!border && r >= (item.counts.second - 1) && r < end.item.counts.second && c >= (item.counts.first - 1) && c < end.item.counts.first) {
                  return cell;
                } else {
                  return this.fields[r * 6 + c];
                }
              });
              break;
          }
        }
      }
    },
    getModifiers(start, end) {
      const modifiers = {
        list: [],
        get: (id) => {
          return modifiers.list.find(v => v.card.name.toLowerCase() === id);
        },
      };
      for (let i = start; i < end; i++) {
        const item = this.tray[i];

        if (item.card.bind === 'mod') {
          modifiers.list.push(item);
        }
      }
      return modifiers;
    },
    findTray(id, start = 0) {
      for (let i = start; i < this.tray.length; i++) {
        const item = this.tray[i];
        if (item.card.name.toLowerCase() === id) return { index: i, item };
      }
      return null;
    },
    transpose(field) {
      return Array.from({ length: 6 }, (_, c) => {
        return Array.from({ length: 6 }, (_, r) => {
          return field[c + r * 6];
        })
      }).flat();
    },
    transformCardFieldToArray(cardfield) {
      const field = [];
      for (const row of cardfield) {
        for (const col of row.split('')) {
          if (col === '1') {
            field.push(1);
          } else {
            field.push(0);
          }
        }
      }
      return field;
    },
    getImage(card) {
      return require('../../../cards/dest/img/icons/' + card.icon + '.png');
    },
    newTray(card) {
      if (card.count) {
        this.form = {
          id: 'new-tray',
          card,
          counts: {},
        };
      } else {
        this.addTray({ card });
      }
    },
    getOptionClass(id, option) {
      if (this.form.counts[id] === option) {
        return ['coder__form-option--active'];
      }
    },
    onSubmitOption(id, option) {
      this.form.counts[id] = option;
      if (this.form.card.count === 2 && (this.form.counts.first && this.form.counts.second) || this.form.card.count === true && this.form.counts.first) {
        this.addTray({
          card: this.form.card,
          counts: this.form.counts,
        });
        this.form = {};
      }
      this.$forceUpdate();
    },
  },
}
</script>

<style lang="sass">
.page
  width: 100vw
  height: 100vh
  overflow: hidden
  box-sizing: border-box
  font-family: sans-serif

.coder
  display: grid
  grid-template-rows: 1fr 1fr 3fr
  width: 100vw
  height: 100vh

  &__fields
    display: flex
    justify-content: center
    align-items: center
    padding: 2em
  
  &__grid
    display: grid
    grid-template-columns: repeat(6, 1fr)
    grid-template-rows: repeat(6, 1fr)
    gap: 3px
    border: 2px solid white
    padding: 2px
  
  &__field
    width: 40px
    height: 40px
    background: white

  &__field--1
    background: black

  &__tray
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))

  &__tray-card
    padding: 0.5em
    box-sizing: border-box

  &__tray-numbers
    display: flex
    justify-content: space-between

  &__tray-number
    aspect-ratio: 1/1
    width: 20%
    background: white
    border: 2px solid black
    padding: 2px
    box-sizing: border-box
    display: flex
    justify-content: center
    align-items: center
    color: black
    font-weight: bold

  &__tray,
  &__control
    border-top: 2px solid white

  &__card
    width: 100%
    padding: .5em
    box-sizing: border-box

  &__control
    overflow-y: scroll

  &__control-grid
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))

  &__form
    position: fixed
    top: 5vh
    left: 5vw
    width: 90vw
    height: 90vh
    background: black
    border: 2px solid white
    padding: 0 1em
    box-sizing: border-box
    overflow: auto
    text-align: center

  &__form-row
    width: 100%
    display: flex
    justify-content: center
    padding: 1em
    box-sizing: border-box

    & + &
      border-top: 2px solid white

  &__form-subject
    width: 10vw

  &__form-options
    display: flex
    justify-content: space-around
    width: 100%

  &__form-option
    aspect-ratio: 1/1
    width: 15%
    background: white
    color: black
    display: flex
    justify-content: center
    align-items: center
    font-size: 10vw
    cursor: pointer

  &__form-option--active
    background: gray

</style>