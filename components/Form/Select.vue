<template lang="pug">
.form-select
  FormError(:id="id")
  FormMulti(ref="widget", :id="id", :schema="schema", :value="value", #default="{ id, index, value, single, onInput, getLabel }", @input="onInput")
    FormError(:id="id")
    .form-select__element
      .form-select__label {{ getLabel(label) }}
      ElSelect.form-select__input(:value="value", @input="onInput", :placeholder="placeholder")
        ElOption(v-for="value, key in options", :key="key", :label="value", :value="key")
</template>
  
<script>  
export default {
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
  },
  computed: {
    label() {
      return this.schema.label;
    },
    multi() {
      return this.schema.multi;
    },
    model() {
      return this.schema.model;
    },
    options() {
      return this.schema.options;
    },
    placeholder() {
      return this.schema.placeholder ?? 'None';
    },
    rules() {
      if (Array.isArray(this.schema.rules)) {
        return this.schema.rules;
      } else if (this.schema.rules) {
        return [this.schema.rules];
      }
      return [];
    },
    widget() {
      return this.$refs.widget;
    },
  },
  methods: {
    getFieldType() {
      return 'input';
    },
    getFieldDataType() {
      return 'string';
    },
    onInput(value) {
      this.$emit('input', value);
    },
    formValidate(form, state) {
      let value = this.value;
      if (this.widget.isSingle || !this.widget.isSingle && value === null) {
        value = [value];
      }
      if (!this.widget.isSingle && this.multi.min !== undefined && value.length < this.multi.min) {
        form.setError(this.id, `this field must have more than ${this.multi.min} values`);
      }
      for (const rule of this.rules) {
        for (const index in value) {
          try {
            rule.validateSync(value[index]);
          } catch (e) {
            if (this.widget.isSingle) {
              form.setError(this.id, e.message);
            } else {
              form.setError(this.id, e.message, index);
            }
          }
        }
      }
    },
  },
};
</script>

<style lang="sass">
.form-select

  &__element
    display: flex

  &__input
    width: 100%

  &__input .el-input__inner
    border-top-left-radius: 0
    border-bottom-left-radius: 0

  &__label
    background: #222
    border-radius: 4px
    border-top-right-radius: 0
    border-bottom-right-radius: 0
    padding: 0 20px
    display: flex
    justify-content: center
    align-items: center
    white-space: nowrap
    font-size: 14px
</style>