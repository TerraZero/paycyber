<template lang="pug">
.form-test
  FormMount(id="form.entity.type", :info="options")
</template>

<script>
import * as Yup from 'yup';

export default {
  data() {
    return {
      options: {
        operation: 'add',
      },
      info: '',
      model: {},
      state: {},
      schema: {
        label: 'Form',
        fields: [
          {
            tag: 'FormInput',
            label: 'Single',
            model: 'single',
            rules: Yup.string().required(),
          },
          {
            tag: 'FormInput',
            label: 'First',
            model: 'first',
            multi: {
              length: 5,
              min: 3,
            },
            rules: Yup.string().required(),
          },
          {
            tag: 'FormGroup',
            label: 'Group',
            model: 'group',
            fields: [
              {
                tag: 'FormInput',
                label: 'Single',
                model: 'single',
              },
              {
                tag: 'FormInput',
                label: 'Inner:',
                model: 'inner',
                multi: {
                  length: 5,
                  label: 'Inner ${index}:',
                  compact: true,
                },
              },
              {
                tag: 'FormInput',
                label: 'Inner:',
                model: 'infinity',
                multi: {
                  length: -1,
                  label: 'Infinity ${index}:',
                  controls: {
                    add: 'Add infinity',
                  },
                },
              },
            ],
          },
        ],
      },
    };
  },
  methods: {
    onInput() {
      this.info = JSON.stringify(this.model, null, 2);
    },
  },
}
</script>
  
<style lang="sass">
.form-test
  display: grid
  grid-template-columns: 1fr 1fr

  .form-root
    padding: 1em
    box-sizing: border-box

  pre
    padding: 1em
    box-sizing: border-box
</style>