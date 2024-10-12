<template lang="pug">
.demo-view-unit-type
  .demo-view-unit-type__label {{ values.label }} ({{ type }}: {{ values.group }})
  .demo-view-unit-type__attrs
    .demo-view-unit-type__attr Stärke 
    .demo-view-unit-type__value {{ values.value.str }}
    .demo-view-unit-type__attr Geschicklichkeit 
    .demo-view-unit-type__value {{ values.value.dex }}
    .demo-view-unit-type__attr Verstand 
    .demo-view-unit-type__value {{ values.value.wit }}
    .demo-view-unit-type__attr Empathy
    .demo-view-unit-type__value {{ values.value.emp }}
    .demo-view-unit-type__attr Images
    .demo-view-unit-type__value {{ imagesVal }}
  .demo-view-unit-type__image-wrapper(v-if="image")
    ElImage.demo-view-unit-type__image(:src="image", fit="contain")
</template>

<script>
export default {
  props: ['entity', 'values', 'type'],

  computed: {

    imagesVal() {
      if (!this.values || !this.values.value.images) return '[X]';
      if (this.values.value.images.length > 1) {
        return '[...' + this.values.value.images.length + ']';
      } else {
        return '[' + this.values.value.images[0].src + ']';
      }
    },

    image() {
      if (!this.values || !this.values.value.images) return null;
      return this.values.value.images[0].src;
    },

  },

}
</script>
  
<style lang="sass">
.demo-view-unit-type

  &__label
    font-size: 1.1em
    font-weight: bold
    padding-bottom: .5em
  
  &__attrs
    display: grid
    grid-template-columns: 1fr minmax(0, 1fr)
    gap: .2em
    padding-bottom: .5em

  &__value
    white-space: nowrap
    text-overflow: ellipsis
    overflow: hidden

  &__image-wrapper
    padding-bottom: .5em

  &__image
    width: 100%
    height: 100px

</style>