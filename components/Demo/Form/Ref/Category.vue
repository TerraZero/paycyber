<template lang="pug">
DemoFormSelect(v-bind="this.$props", :options="options", @input="onInput", filterable)
</template>
  
<script>  
export default {
  props: ['value', 'label'],

  data() {
    return {
      options: {
        other: 'Andere',
        melee: 'Nahkampf',
        sword: 'Schwert',
        armor: 'Rüstung',
        bow: 'Bogen',
        pistol: 'Pistole',
        rifle: 'Gewehr',
      },
    };
  },

  methods: {

    onInput(e) {
      this.$emit('input', e);
    },

  },

};
</script>

<style lang="sass">

</style>