<template lang="pug">
ElButton(@click="onClick", size="small") {{ label }}
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
  inject: [
    'formRoot',
  ],
  computed: {
    label() {
      return this.schema.label;
    },
  },
  methods: {
    getFieldType() {
      return 'button';
    },
    getFieldDataType() {
      return 'null';
    },
    onClick() {
      this.formRoot.doSubmit({
        id: this.id,
        schema: this.schema,
      });
    },
    formValidate(form, state) {
      
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