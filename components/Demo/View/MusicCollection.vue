<template lang="pug">
.demo-view-music-collection
  .demo-view-music-collection__label {{ values.label }} ({{ type }}: {{ values.group }})
  ElImage.demo-view-image-collection__teaser(v-if="teaser", :src="teaser")
  .demo-view-music-collection__ids
    .demo-view-music-collection__id(v-for="id in ids", :key="id") {{ id }}
</template>

<script>
import ActiveEntity from '~/custom/system/modules/controller/ActiveEntity';

export default {
  props: ['entity', 'values', 'type'],

  data() {
    return {
      teaser_entity: null,
    };
  },

  computed: {

    ids() {
      return this.values.value.musics.map(v => v.group);
    },

    teaser() {
      if (this.teaser_entity === null && this.values.value.teaser && this.values.value.teaser.length) {
        ActiveEntity.single('Demo', this.values.value.teaser[0]).then(v => {
          this.teaser_entity = v;
        });
      }
      if (this.teaser_entity !== null) {
        return this.teaser_entity.values.value.src;
      }
      return null;
    },

  },

}
</script>
  
<style lang="sass">
.demo-view-music-collection

  &__label
    font-size: 1.1em
    font-weight: bold
    padding-bottom: .5em
  
  &__ids
    display: grid
    grid-template-columns: 1fr
    gap: .2em

</style>