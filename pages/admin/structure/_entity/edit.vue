<template lang="pug">
LayoutAdminPage(:params="params")
  FormMount(v-if="info", id="form.entity.type", :info="info")
</template>

<script>
export default {
  async asyncData({ params }) {
    return {
      params: params,
      info: {
        operation: 'edit',
        type: params.entity,
      },
    };
  },
  data() {
    return {
      params: null,
    };
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