<template lang="pug">
.demo-view-music(:class="classes")
  .demo-view-music__label {{ values.label }} ({{ type }}: {{ values.group }})
  ElImage.demo-view-music__image(v-if="src", :src="src")
    template(#placeholder)
      | No image
    template(#error)
      | No image
</template>

<script>
export default {
  props: ['entity', 'values', 'type', 'options'],

  computed: {

    classes() {
      const classes = [];

      if (this.options.light) classes.push('light');
      if (this.values.value.image || this.values.value.provider === 'howler') classes.push('has-image');
      return classes.map(v => 'demo-view-music--' + v);
    },

    src() {
      if (this.values.value.src) {
        if (this.values.value.image) {
          return this.values.value.image;
        }
        switch (this.values.value.provider) {
          case 'youtube':
            return 'https://img.youtube.com/vi/' + this.values.value.src + '/hqdefault.jpg';
          case 'howler':
            return 'https://howlerjs.com/assets/images/logo-big.svg';
        }
      }
    },

  },
}
</script>
  
<style lang="sass">
.demo-view-music

  &__label
    font-size: 1.1em
    font-weight: bold
    padding-bottom: .5em

  &--has-image &__image
    width: 100%
    aspect-ratio: 4/3
    background: #282828
    padding: 1em
    box-sizing: border-box
    border-radius: var(--element-radius--all)

  &--light &__label
    color: white

</style>