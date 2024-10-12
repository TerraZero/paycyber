<template lang="pug">
.form-mount
  FormRoot(ref="form", v-if="schema", :schema="schema", :state.sync="state", v-model="model", @form:submit="onSubmit")
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    info: {
      type: Object,
    },
  },
  async fetch() {
    const formschema = await this.$axios.$get(`/api/form/${this.id}/schema`, {
      params: {
        info: this.info ?? null,
      },
    });
    this.model = formschema.model;
    this.schema = formschema.schema;
    this.state = formschema.state;
  },
  data() {
    return {
      schema: false,
      model: false,
      state: false,
    };
  },
  computed: {
    form() {
      return this.$refs.form;
    },
  },
  methods: {
    async onSubmit(data) {
      console.log(data);
      const response = await this.$axios.$post(`/api/form/${this.id}/submit`, data);

      this.schema = response.schema;
      this.model = response.model;
      this.state = response.state;

      if (response.state.redirect && response.state.redirect.url) {
        this.$router.push(response.state.redirect.url);
      }
    },
  },
};
</script>

<style lang="sass">

</style>