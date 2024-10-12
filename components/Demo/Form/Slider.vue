<template lang="pug">
.demo-form-slider
  .demo-form-slider__label {{ label }}
  ElSlider.demo-form-slider__input(:value="value", @input="$emit('input', $event)", show-input, input-size="mini", v-bind="props")
</template>
  
<script>  
import Util from '~/custom/system/modules/utils/Util';

export default {
  props: ['label', 'value', 'min', 'max', 'step'],
  computed: {
    
    props() {
      const props = Util.copy(this.$props || {});

      delete props.label;
      return props;
    },

  },
};
</script>

<style lang="sass">
.demo-form-slider
  display: flex

  &__input
    width: 100%
    background: white
    border: 1px solid white
    border-radius: 4px
    border-top-left-radius: 0
    border-bottom-left-radius: 0
    padding-left: 1em

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