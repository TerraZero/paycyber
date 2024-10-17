<template lang="pug">
DemoEntityFormBase.demo-entity-music-collection-form(ref="base", title="Music Collection", type="screen.music.collection", @load="onLoad", @save="onSave", @close="onClose", @finish="onFinish")
  DemoFormInput(label="Label", v-model="label")
  DemoFormInput(label="ID", v-model="group", :disabled="entity && !entity.isNew")
  DemoFormRefEntity(label="Teaser", v-model="teaser", type="screen.image", game="myz", :max="1")
  DemoFormRefEntity(label="Musics", v-model="musics", field="id", type="screen.music", game="myz")
</template>

<script>
import FormBase from './FormBase.mixin';

export default {
  mixins: [FormBase],

  data() {
    return {
      entity: null,
      label: '',
      group: '',
      teaser: [],
      musics: [],
    };
  },

  methods: {

    pack(entity) {
      entity.values.label = this.label;
      entity.values.group = this.group;
      entity.values.value.teaser = this.teaser;
      entity.values.value.musics = this.musics;
    },

    unpack(entity) {
      this.label = entity.values.label ?? '';
      this.group = entity.values.group ?? '';
      this.teaser = entity.values.value.teaser ?? [];
      this.musics = entity.values.value.musics ?? [];
    },

  },
}
</script>
  
<style lang="sass">

</style>