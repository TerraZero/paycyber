<template lang="pug">
.form-group(:class="classes")
  label.form-group__label(v-if="label") {{ label }}
  .form-group__fields
    component(ref="fields", v-for="field in fields", :is="field.tag", :key="field.model", :value="getValue(field.model)", :id="id + '.' + field.model", :schema="field", @input="onInput(field.model, $event)")
</template>
  
<script>  
import Debug from './Debug.mixin';
import Vue from 'vue';

export default {
  mixins: [Debug],
  props: {
    schema: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    value: {},
    root: Boolean,
  },
  watch: {
    value: function(value) {
      this.proxy = value ?? {};
    },
  },
  provide() {
    return {
      form: this,
    };
  },
  inject: [
    'form',
  ],
  data() {
    return {
      proxy: this.value ?? {},
    };
  },
  computed: {
    classes() {
      const classes = [];

      if (this.schema.border) {
        classes.push('form-group--border');
      }
      if (this.schema.empty_hide && this.fields.length === 0) {
        classes.push('form-group--hide');
      }
      return classes;
    },
    label() {
      return this.schema.label;
    },
    multi() {
      return this.schema.multi;
    },
    fields() {
      return this.schema.fields;
    },
    model() {
      return this.schema.model;
    },
    formFields() {
      return this.$refs.fields;
    },
  },
  methods: {
    getFieldType() {
      return this.root ? 'form' : 'group';
    },
    getFieldDataType() {
      return 'object';
    },
    getValue(key) {
      return this.proxy[key] ?? null;
    },
    onInput(key, value) {
      Vue.set(this.proxy, key, value);
      this.$emit('input', this.proxy);
    },
    formValidate(form, state) {
      for (const field of this.formFields) {
        field.formValidate(form, state);
      }
    },
  },
};
</script>

<style lang="sass">
.form-group

  &--border
    border: 1px solid white
    margin: 1em 0

  &--hide
    display: none !important

  &__label
    font-size: 1.2em
    padding: 0 8px 8px

  .form-root--ui-simple &
    display: flex
    flex-direction: column
    padding: 1em
    box-sizing: border-box
</style>