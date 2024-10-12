<template lang="pug">
.content-view-image(:class="classes")
  .content-view-image__image(:style="styles")
</template>
  
<script>  
export default {
  props: ['url', 'demo', 'contain', 'scale', 'posx', 'posy', 'rotate'],
  computed: {

    classes() {
      const classes = [];

      if (this.demo) classes.push('content-view-image--demo');
      return classes;
    },

    styles() {
      const styles = {};

      if (this.url) {
        styles['background-image'] = `url(${this.url})`;
      }
      if (this.contain) {
        styles['background-size'] = 'contain';
      } else {
        styles['background-size'] = 'cover';
      }
      const transform = [];

      if (this.scale) {
        transform.push(`scale(${this.scale})`);
      }
      if (this.posx) {
        transform.push(`translateX(${this.posx}%)`);
      }
      if (this.posy) {
        transform.push(`translateY(${this.posy}%)`);
      }
      if (this.rotate) {
        transform.push(`rotate(${this.rotate}deg)`);
      }
      styles['transform'] = transform.join(' ');
      return styles;
    },

  },
};
</script>

<style lang="sass">
.content-view-image
  aspect-ratio: 16/9
  position: relative
  overflow: hidden
  
  &--demo
    border: 1px solid white
    background: #121212

  &__image
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-repeat: no-repeat
</style>