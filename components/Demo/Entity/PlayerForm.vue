<template lang="pug">
DemoEntityFormBase.demo-entity-player-form(ref="base", title="Player", type="battle.player", @load="onLoad", @save="onSave", @close="onClose", @finish="onFinish")
  DemoFormInput(label="Label", v-model="label")
  DemoFormInput(label="ID", v-model="group", :disabled="entity && !entity.isNew")
  .demo-entity-player-form__attrs
    DemoFormInput(label="Stärke", v-model="str")
    DemoFormInput(label="T. Stärke", v-model="t_str")
    DemoFormInput(label="Geschicklichkeit", v-model="dex")
    DemoFormInput(label="T. Geschicklichkeit", v-model="t_dex")
    DemoFormInput(label="Verstand", v-model="wit")
    DemoFormInput(label="T. Verstand", v-model="t_wit")
    DemoFormInput(label="Empathie", v-model="emp")
    DemoFormInput(label="T. Empathie", v-model="t_emp")
  .demo-entity-enemy-type-form__multi
    .demo-entity-enemy-type-form__field(v-for="image, key in images", :key="key")
      DemoFormInput(:label="'Image ' + (key + 1)", v-model="image.src")
      ElButton(type="danger", icon="el-icon-delete", @click="onDeleteImage(key)")
    ElButton.demo-entity-enemy-type-form__add-field(type="primary", icon="el-icon-plus", @click="onAddImage") Add Image
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
      str: 0,
      t_str: 0,
      dex: 0,
      t_dex: 0,
      wit: 0,
      t_wit: 0,
      emp: 0,
      t_emp: 0,
      images: [
        {
          src: '',
        },
      ],
    };
  },

  methods: {

    pack(entity) {
      entity.values.label = this.label;
      entity.values.group = this.group;
      entity.values.value.str = this.str;
      entity.values.value.t_str = this.t_str;
      entity.values.value.dex = this.dex;
      entity.values.value.t_dex = this.t_dex;
      entity.values.value.wit = this.wit;
      entity.values.value.t_wit = this.t_wit;
      entity.values.value.emp = this.emp;
      entity.values.value.t_emp = this.t_emp;
      entity.values.value.images = this.images;
    },

    unpack(entity) {
      this.label = entity.values.label ?? '';
      this.group = entity.values.group ?? '';
      this.str = entity.values.value.str ?? 0;
      this.t_str = entity.values.value.t_str ?? 0;
      this.dex = entity.values.value.dex ?? 0;
      this.t_dex = entity.values.value.t_dex ?? 0;
      this.wit = entity.values.value.wit ?? 0;
      this.t_wit = entity.values.value.t_wit ?? 0;
      this.emp = entity.values.value.emp ?? 0;
      this.t_emp = entity.values.value.t_emp ?? 0;
      this.images = entity.values.value.images ?? [
        {
          src: '',
        },
      ];
    },

    onDeleteImage(index) {
      this.images.splice(index, 1);
      if (this.images.length === 0) {
        this.onAddImage();
      }
    },

    onAddImage() {
      this.images.push({
        src: '',
      });
    },

  },
}
</script>
  
<style lang="sass">
.demo-entity-player-form
  --demo-form--label-min-width: 150px

  &__attrs
    display: grid
    grid-template-columns: 1fr 1fr
    gap: 1em

  &__field
    display: grid
    grid-template-columns: 1fr min-content
    gap: 1em
    padding-bottom: 1em

  &__add-field
    width: 100%

</style>