<template lang="pug">
.demo-form-text
  .demo-form-text__label {{ label }}
  ElInput.demo-form-text__textarea(v-bind="props", type="textarea", @input="$emit('input', $event)")
</template>

<script>
import Util from '~/custom/system/modules/utils/Util';

export default {
  props: ['label', 'value', 'disabled', 'rows'],
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
.demo-form-text
  width: 100%

  &__label
    background: #222
    display: inline-block
    padding: 1em 1.5em

  &__textarea .el-textarea__inner
    border-radius: 0

</style>