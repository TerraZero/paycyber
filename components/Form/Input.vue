<template lang="pug">
.form-input
  FormError(:id="id")
  FormMulti(ref="widget", :id="id", :schema="schema", :value="value", #default="{ id, index, value, single, onInput, getLabel }", @input="onInput")
    FormError(:id="id")
    ElInput.form-input__input(type="text", :value="value", @input="onInput")
      template(#prepend) {{ getLabel(label) }}
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
        console.log(value, this.value);
        form.setError(this.id, `this field must have more than ${this.multi.min} values`);
      }
      for (const rule of this.rules) {
        for (const index in value) {
          try {
            console.log(this.id, index, value);
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
.form-input

  &__input
    color: black
    width: 100%
    padding: 2px 5px

  .form-root--ui-simple &
    margin-bottom: 1em

</style>