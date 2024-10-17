<template lang="pug">
DemoEntityFormBase.demo-entity-image-form(ref="base", title="Image", type="screen.image", @load="onLoad", @save="onSave", @close="onClose", @finish="onFinish")
  DemoFormInput(label="Label", v-model="label")
  DemoFormInput(label="ID", v-model="group", :disabled="entity && !entity.isNew")
  DemoFormImage(label="Source", v-model="src")
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
      src: '',
    };
  },

  methods: {

    pack(entity) {
      entity.values.label = this.label;
      entity.values.group = this.group;
      entity.values.value.src = this.src;
    },

    unpack(entity) {
      this.label = entity.values.label ?? '';
      this.group = entity.values.group ?? '';
      this.src = entity.values.value.src ?? '';
    },

  },
}
</script>
  
<style lang="sass">
</style>