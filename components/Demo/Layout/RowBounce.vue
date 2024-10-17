<template lang="pug">
transition-group.demo-layout-row-bounce(name="flip-list")
  .demo-layout-row-bounce__item(v-for="item, index in row", :key="item", :style="itemStyle(index)")
    slot(:item="get(item)", :index="index")
</template>

<script>
import StateEntity from '~/custom/system/modules/controller/StateEntity';

export default {

  props: ['id', 'items', 'max'],

  data() {
    return {
      state: null,
      offset: 0,
      row: [],
      interval: null,
    };
  },

  methods: {

    async load() {
      this.state = await StateEntity.load('myz', 'row.bounce.' + this.id, 'Row Bounce (' + this.id + ')', {
        offset: 0,
        row: [],
      }, this);
    },

    remove(index = 0) {
      this.items.splice(index, 1);
    },

    add(item, index = null) {
      if (index !== null && index < this.items.length) {
        this.items.splice(index, 0, item);
      } else {
        this.items.push(item);
      }
    },

    get(index) {
      return this.items[index] ?? null;
    },

    itemStyle(index) {
      const styles = {
        '--transition-delay': ((index - 1) * .05 + 1) + 's',
      };
      return styles;
    },

    intro() {
      this.offset = 0;
      this.row = [];
      this.interval = setInterval(() => {
        if (this.row.length >= this.items.length || this.row.length >= this.max) {
          clearInterval(this.interval);
          this.state.up();
        } else {
          this.row.push(this.row.length);
        }
      }, 200);
    },

    next() {
      const next = this.row.shift();
      this.offset++;
      if (this.offset + this.row.length < this.items.length) {
        this.row.push(this.offset + this.row.length);
      }
      this.state.up();
      this.$emit('next', this.get(next));
      return this.get(next) ?? null;
    },

  },

}
</script>

<style lang="sass">
.demo-layout-row-bounce

  &__item
    display: inline-block
    vertical-align: top
    transition: width var(--demo-layout-row-bounce--timing, 1s), height var(--demo-layout-row-bounce--timing, 1s)

.flip-list-move
  transition: transform var(--transition-delay, 1s) cubic-bezier(.4,-0.4,.4,.8), width var(--demo-layout-row-bounce--timing, 1s), height var(--demo-layout-row-bounce--timing, 1s)

.flip-list-leave-active
  transition: all 1s .2s
  position: absolute

.flip-list-leave-to
  opacity: 0
  transform: translateY(50%)

.flip-list-enter-active
  transition: all .2s
  position: absolute

.flip-list-enter
  opacity: 0
  transform: translateY(-50%)

.flip-list-enter-to
  opacity: 1
  transform: translateY(0)

</style>