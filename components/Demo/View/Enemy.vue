<template lang="pug">
.demo-view-player
  .demo-view-player__label {{ values.label }} ({{ type }}: {{ values.group }})
  .demo-view-player__attrs
    .demo-view-player__attr Stärke 
    .demo-view-player__value {{ values.value.str }}
    .demo-view-player__attr Geschicklichkeit 
    .demo-view-player__value {{ values.value.dex }}
    .demo-view-player__attr Verstand 
    .demo-view-player__value {{ values.value.wit }}
    .demo-view-player__attr Empathy
    .demo-view-player__value {{ values.value.emp }}
</template>

<script>
export default {
  props: ['entity', 'values', 'type'],
}
</script>
  
<style lang="sass">
.demo-view-player

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

</style>