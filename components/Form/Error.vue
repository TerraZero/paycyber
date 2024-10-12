<template lang="pug">
.form-error
  ElAlert(v-for="message, index in messages", :key="index", type="error", effect="dark", :title="message")
</template>
  
<script>  
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  inject: [
    'formRoot',
  ],
  data() {
    return {
      messages: [],
    };
  },
  created() {
    this.formRoot.$on('changeState', (form) => {
      this.update(form);
    });
  },
  methods: {
    update(form) {
      this.messages = form.getErrors(this.id.substring(1));
    },
  },
};
</script>

<style lang="sass">
.form-error
  color: red

</style>