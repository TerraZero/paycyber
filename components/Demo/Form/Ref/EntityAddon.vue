<template lang="pug">
.demo-form-ref-entity-addon
  slot
  ElDialog(:visible.sync="open", width="90%", :close-on-click-modal="false", append-to-body, @close="onSave")
    .demo-form-ref-entity-addon__dialog-content(v-if="index !== null")
      DemoFormInput(label="Game", v-model="current.game", :disabled="true")
      DemoFormInput(label="Type", v-model="current.type", :disabled="true")
      DemoFormInput(label="Group (ID)", v-model="current.group", :disabled="true")
      slot(name="fields", :current="current")
    template(#footer)
      ElButton(type="primary", icon="el-icon-edit", @click="onSave") Save
</template>

<script>
export default {
  props: ['value'],

  provide() {
    return {
      addon: this,
    };
  },

  data() {
    return {
      open: false,
      index: null,
    };
  },

  computed: {

    current() {
      return this.value[this.index];
    },

  },

  methods: {

    onEdit(index) {
      this.index = index;
      this.open = true;
    },

    onSave() {
      this.open = false;
      this.index = null;
    },

  },

};
</script>

<style lang="sass">
.demo-form-ref-entity-addon

  &__dialog-content
    display: grid
    grid-template-columns: 1fr
    gap: 1em
</style>