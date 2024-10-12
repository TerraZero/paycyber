<template lang="pug">
.layout-demo-page
  transition(name="fade-up")
    .layout-demo-page__content(v-if="loaded")
      .layout-demo-page__header
        h1.layout-demo-page__title {{ title }}
      .layout-demo-page__content-group
        slot
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      require: true,
    },
  },
  data() {
    this.$nextTick(() => {
      this.loaded = true;
    });
    return {
      loaded: false,
    };
  },
}
</script>
  
<style lang="sass">
.layout-demo-page
  background: #121212
  min-height: 100vh
  box-sizing: border-box
  display: flex
  
  &__content
    box-sizing: border-box
    padding: 0 1em
    width: 100%

  &__content-group
    background: #333
    max-width: 1200px
    border: 2px solid black
    box-sizing: border-box
    margin: 0 auto
    box-shadow: 0 10px 10px black
    width: 100%
    border: 1px solid white
    padding: 1em

    &:first-child
      margin-top: 1em

  &__header
    margin: 0 auto
    max-width: 1200px

  &__title
    margin-bottom: 0

</style>