<template lang="pug">
ElInput.demo-form-input(v-bind="props", @input="$emit('input', $event)")
  template(#prepend) {{ label }}
</template>

<script>
import Util from '~/custom/system/modules/utils/Util';

export default {
  props: ['label', 'value', 'disabled'],
  computed: {

    props() {
      const props = Util.copy(this.$props || {});

      delete props.label;
      return props;
    },
    
  },
}
</script>
  
<style lang="sass">
.demo-form-input

  .el-input-group__prepend
    min-width: var(--demo-form--label-min-width)
    text-align: center
</style>