<template lang="pug">
.demo-view-music(:class="classes")
  .demo-view-music__label {{ values.label }} ({{ type }}: {{ values.group }})
  ElImage(:src="src")
</template>

<script>
export default {
  props: ['entity', 'values', 'type', 'options'],

  computed: {

    classes() {
      const classes = [];

      if (this.options.light) classes.push('light');
      return classes.map(v => 'demo-view-music--' + v);
    },

    src() {
      if (this.values.value.src) {
        return 'https://img.youtube.com/vi/' + this.values.value.src + '/hqdefault.jpg';
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

  &--light &__label
    color: white

</style>