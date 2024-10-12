<template lang="pug">
DemoEntityFormBase.demo-entity-enemy-type-form(ref="base", title="Enemy Type", type="battle.enemy.type", @load="onLoad", @save="onSave", @close="onClose", @finish="onFinish")
  DemoFormInput(label="Label", v-model="label")
  DemoFormInput(label="ID", v-model="group", :disabled="entity && !entity.isNew")
  DemoFormInput(label="Stärke", v-model="str")
  DemoFormInput(label="Geschicklichkeit", v-model="dex")
  DemoFormInput(label="Verstand", v-model="wit")
  DemoFormInput(label="Empathie", v-model="emp")
  .demo-entity-enemy-type-form__multi
    .demo-entity-enemy-type-form__field(v-for="image, key in images", :key="key")
      DemoFormImage(:label="'Image ' + (key + 1)", v-model="image.src")
      ElButton(type="danger", icon="el-icon-delete", @click="onDeleteImage(key)")
    ElButton.demo-entity-enemy-type-form__add-field(type="primary", icon="el-icon-plus", @click="onAddImage") Add Image
  DemoFormInput(label="Items Anzahl", v-model="items_count")
  DemoFormInput(label="Items Schwelle", v-model="items_threshold")
  DemoViewComposeRandomSectors(:count="items_count", :threshold="items_threshold")
  DemoFormComposeItems(v-model="items")
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
      str: '1-3',
      dex: '1-3',
      wit: '1-3',
      emp: '1-3',
      images: [
        {
          src: '',
        },
      ],
      items_count: '1-2',
      items_threshold: 33,
      items: [],
    };
  },

  methods: {

    pack(entity) {
      entity.values.label = this.label;
      entity.values.group = this.group;
      entity.values.value.str = this.str;
      entity.values.value.dex = this.dex;
      entity.values.value.wit = this.wit;
      entity.values.value.emp = this.emp;
      entity.values.value.images = this.images;
      entity.values.value.items_count = this.items_count;
      entity.values.value.items_threshold = this.items_threshold;
      entity.values.value.items = this.items;
    },

    unpack(entity) {
      this.label = entity.values.label ?? '';
      this.group = entity.values.group ?? '';
      this.str = entity.values.value.str ?? '1-3';
      this.dex = entity.values.value.dex ?? '1-3';
      this.wit = entity.values.value.wit ?? '1-3';
      this.emp = entity.values.value.emp ?? '1-3';
      this.items_count = entity.values.value.items_count ?? '1-2';
      this.items_threshold = entity.values.value.items_threshold ?? 33;
      this.images = entity.values.value.images ?? [
        {
          src: '',
        },
      ];
      this.items = entity.values.value.items ?? [];
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
.demo-entity-enemy-type-form
  --demo-form--label-min-width: 150px

  &__field
    display: grid
    grid-template-columns: 1fr min-content
    gap: 1em
    padding-bottom: 1em

  &__add-field
    width: 100%

  &__multi
    border: 1px solid #111
    padding: 1em

</style>