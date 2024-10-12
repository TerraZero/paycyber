<template lang="pug">
.demo-form-select
  .demo-form-select__label {{ label }}
  ElSelect.demo-form-select__input(:value="value", @input="$emit('input', $event)", placeholder="Choose", v-bind="props")
    ElOption(v-for="value, key in options", :key="key", :label="value", :value="key")
</template>
  
<script>  
import Util from '~/custom/system/modules/utils/Util';

export default {
  props: ['label', 'value', 'options', 'tagging'],
  computed: {
    
    props() {
      const props = Util.copy(this.$props || {});

      delete props.label;
      delete props.options;
      if (this.tagging !== undefined) {
        props['filterable'] = true;
        props['allow-create'] = true;
        delete props.tagging;
      }
      return props;
    },

  },
};
</script>

<style lang="sass">
.demo-form-select
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
    min-width: var(--demo-form--label-min-width)
    color: var(--demo-form--label-color, white)

</style>