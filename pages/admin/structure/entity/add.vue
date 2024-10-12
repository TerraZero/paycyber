<template lang="pug">
LayoutAdminPage(:params="params")
  FormMount(id="form.entity.type", :info="info")
</template>

<script>
export default {
  data() {
    return {
      params: null,
      info: {
        operation: 'add',
      },
    };
  }
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