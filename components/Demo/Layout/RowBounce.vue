<template lang="pug">
transition-group.demo-layout-row-bounce(name="flip-list")
  .demo-layout-row-bounce__item(v-for="item, index in row", :key="item", :style="itemStyle(index)")
    slot(:item="item", :index="index")
</template>

<script>

export default {

  props: ['items', 'max'],

  data() {
    return {
      offset: 0,
      row: [],
      interval: null,
    };
  },

  methods: {

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
        } else {
          this.row.push(this.items[this.row.length]);
        }
      }, 200);
    },

    next() {
      const next = this.row.shift();
      this.offset++;
      if (this.offset + this.row.length < this.items.length) {
        this.row.push(this.items[this.offset + this.row.length]);
      }
      this.$emit('next', next);
      return next ?? null;
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