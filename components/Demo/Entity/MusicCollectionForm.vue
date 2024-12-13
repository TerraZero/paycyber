<template lang="pug">
DemoEntityFormBase.demo-entity-music-collection-form(ref="base", title="Music Collection", type="screen.music.collection", @load="onLoad", @save="onSave", @close="onClose", @finish="onFinish")
  DemoFormInput(label="Label", v-model="label")
  DemoFormInput(label="ID", v-model="group", :disabled="entity && !entity.isNew")
  DemoFormRefEntity(label="Teaser", v-model="teaser", type="screen.image", game="myz", :max="1")
  DemoFormRefEntity(label="Musics", v-model="musics", field="id", type="screen.music", game="myz")
  template(#sidebar)
    DemoFormCheckboxes(label="Properties", v-model="properties", :options="propertiesOptions", mode="props")
</template>

<script>
import FormBase from './FormBase.mixin';

export default {
  mixins: [FormBase],

  data() {
    return {
      propertiesOptions: {
        loop: 'Loop',
        shuffle: 'Shuffle',
        random: 'Random',
      },
      entity: null,
      label: '',
      group: '',
      properties: {},
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
      entity.values.value.properties = this.properties;
    },

    unpack(entity) {
      this.label = entity.values.label ?? '';
      this.group = entity.values.group ?? '';
      this.teaser = entity.values.value.teaser ?? [];
      this.musics = entity.values.value.musics ?? [];
      this.properties = entity.values.value.properties ?? {};
    },

  },
}
</script>
  
<style lang="sass">

</style>