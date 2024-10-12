<template lang="pug">
.form-actions
  .form-actions__fields
    component(v-for="field in fields", :is="field.tag", :key="field.model", :id="id + '.' + field.model", :schema="field")
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
    fields() {
      return this.schema.fields;
    },
    formFields() {
      return this.$refs.fields;
    },
  },
  methods: {
    getFieldType() {
      return 'actions';
    },
    getFieldDataType() {
      return 'null';
    },
    formValidate(form, state) {
      
    },
  },
};
</script>

<style lang="sass">
.form-actions
  text-align: right
</style>