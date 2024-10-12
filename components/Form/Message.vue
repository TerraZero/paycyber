<template lang="pug">
.form-message(:class="classes")
  .form-message__icon
    i.el-icon-warning
  .form-message__message
    | {{ schema.message }}
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
    classes() {
      const classes = [];

      classes.push('form-message--type-' + (this.schema.type ?? 'default'));
      return classes;
    },
  },
  methods: {
    getFieldType() {
      return 'null';
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
.form-message
  margin: .5em 0
  display: grid
  grid-template-columns: 40px 1fr

  &--type-danger
    background: #572e2e
    border: 1px solid #F56C6C
    border-radius: 3px

  &__icon
    background: #F56C6C
    display: flex
    justify-content: center
    align-items: center
    font-size: 1.5em

  &__message
    padding: .5em
</style>