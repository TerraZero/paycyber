<template lang="pug">
.demo-form-checkboxes
  .demo-form-checkboxes__label {{ label }}
  .demo-form-checkboxes__group
    ElCheckbox(v-for="option, index in options", :key="index") {{ option }}
</template>
  
<script>  
import Util from '~/custom/system/modules/utils/Util';

export default {
  props: ['label', 'value', 'options'],
  computed: {
    
    props() {
      const props = Util.copy(this.$props || {});

      delete props.label;
      delete props.options;
      return props;
    },

  },
};
</script>

<style lang="sass">
.demo-form-checkboxes
  display: flex

  &__input
    width: 100%

  &__input .el-input__inner
    border-top-left-radius: 0
    border-bottom-left-radius: 0

  &__label
    background: #222
    border-radius: 4px
    border-top-right-radius: 0
    border-bottom-right-radius: 0
    padding: 0 20px
    display: flex
    justify-content: center
    align-items: center
    white-space: nowrap
    font-size: 14px
</style>