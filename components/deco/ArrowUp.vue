<template lang="pug">
.deco-arrow-up(:class="cc", :style="cs")
  .deco-arrow-up__content
    .deco-arrow-up__first
    .deco-arrow-up__second
    .deco-arrow-up__third
    .deco-arrow-up__fill
</template>

<script>
export default {
  props: ['size', 'direction', 'animated'],
  mounted() {
    console.log(this.$el.name);
    console.log(this.$el.tagName);
    console.log(this.$el.nodeName);
    console.log(this.$el.className);
    console.log(this.$el.localName);
    console.log(this.$options.name)  
  },  
  computed: {
    classes() {
      this.$el.name
      const classes = [];

      if (this.animated) classes.push('animated');
      return classes;
    },
    styles() {
      const styles = {};
      
      for (const index in this.vars) {
        styles['--deco-arrow-up--' + index] = this.vars[index];
      }
      return styles;
    },
    dir() {
      return {
        up: '-90deg',
      }[this.direction ?? 'up'];
    },
    vars() {
      return {
        direction: this.dir,
        size: this.size,
      };
    },
  },
}
</script>

<style lang="sass">
.deco-arrow-up
  display: flex
  justify-content: center
  align-items: center

  &__content
    width: var(--deco-arrow-up--size)
    height: 100%

  &__first,
  &__second,
  &__third
    display: block
    background: yellow
    width: var(--deco-arrow-up--size)
    height: var(--deco-arrow-up--size)
    clip-path: polygon(60% 0, 100% 50%, 60% 100%, 0% 100%, 40% 50%, 0% 0%)
    transform: rotate(var(--deco-arrow-up--direction))

  &__third
    clip-path: polygon(60% 0, 100% 50%, 60% 100%, 0% 100%, 0 50%, 0% 0%)

  &__fill
    height: calc(100% - 3 * var(--deco-arrow-up--size))
    background: yellow

</style>