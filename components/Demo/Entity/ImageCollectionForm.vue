<template lang="pug">
DemoEntityFormBase.demo-entity-image-collection-form(ref="base", title="Image Collection", type="screen.image.collection", @load="onLoad", @save="onSave", @close="onClose", @finish="onFinish")
  DemoFormInput(label="Label", v-model="label")
  DemoFormInput(label="ID", v-model="group", :disabled="entity && !entity.isNew")
  DemoFormRefEntity(label="Teaser", v-model="teaser", type="screen.image", game="myz", :max="1")
  DemoFormRefEntityAddon(v-model="images")
    template(#default)
      DemoFormRefEntity(label="Images", v-model="images", type="screen.image", game="myz", chain)
        template(#default="{ item }")
          | Time: {{ item.time }}s
    template(#fields="{ current }")
      DemoFormInput(label="Time", v-model="current.time")
  DemoFormRefEntity(label="Auto Start Music", v-model="automusic", type="screen.music.collection", game="myz", :max="1")
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
      images: [],
      automusic: [],
    };
  },

  methods: {

    pack(entity) {
      entity.values.label = this.label;
      entity.values.group = this.group;
      entity.values.value.teaser = this.teaser;
      entity.values.value.images = this.images;
      entity.values.value.automusic = this.automusic;
    },

    unpack(entity) {
      this.label = entity.values.label ?? '';
      this.group = entity.values.group ?? '';
      this.teaser = entity.values.value.teaser ?? [];
      this.images = entity.values.value.images ?? [];
      this.automusic = entity.values.value.automusic ?? [];
    },

  },
}
</script>
  
<style lang="sass">

</style>