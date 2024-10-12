<template lang="pug">
LayoutAdminPage(:params="params")
  FormMount(v-if="info", id="form.entity.type.create.field", :info="info")
</template>

<script>
const Request = require('~/custom/frontend/Request');

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
  async fetch({ params }) {
    const list = await Request.create('schema/list/fieldmap').deep('list').GET({
      load: true,
      entity: params.entity,
    });
    console.log(list);
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