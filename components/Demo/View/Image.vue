<template lang="pug">
.demo-view-image(:class="classes")
  .demo-view-image__label {{ values.label }} ({{ type }}: {{ values.group }})
  ToolDerivate(:src="src", resize="320,240")
</template>

<script>
export default {
  props: ['entity', 'values', 'type', 'options'],

  computed: {

    classes() {
      const classes = [];

      if (this.options.light) classes.push('light');
      return classes.map(v => 'demo-view-image--' + v);
    },

    src() {
      return this.values.value.src;
    },

  },
}
</script>
  
<style lang="sass">
.demo-view-image

  &__label
    font-size: 1.1em
    font-weight: bold
    padding-bottom: .5em

  &--light &__label
    color: white

</style>