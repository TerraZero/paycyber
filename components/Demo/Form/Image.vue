<template lang="pug">
.demo-form-image
  ElInput.demo-form-image__input(v-bind="props", @input="$emit('input', $event)")
    template(#prepend) {{ label }}
  ElButton(icon="el-icon-full-screen", @click="onOpen")
  ElDialog(:title="value", :visible.sync="open", width="90%", :close-on-click-modal="false", append-to-body)
    .demo-form-image__fullscreen(:class="dialogClasses")
      ElSwitch.demo-form-image__switch(v-model="dark", active-color="#333", inactive-color="#CCC", active-text="Dark", inactive-text="Light")
      .demo-form-image__image
        .demo-form-image__trans
        ElImage(:src="value")
          .demo-form-image__image-error(slot="error")
            | FAILED
</template>

<script>
import Util from '~/custom/system/modules/utils/Util';

export default {
  props: ['label', 'value', 'disabled'],

  data() {
    return {
      open: false,
      dark: false,
    };
  },

  computed: {

    dialogClasses() {
      const classes = [];

      if (this.dark) classes.push('dark');
      return classes.map(v => 'demo-form-image--' + v);
    },

    props() {
      const props = Util.copy(this.$props || {});

      delete props.label;
      return props;
    },
    
  },

  methods: {

    onOpen() {
      this.open = true;
    },

  },

}
</script>
  
<style lang="sass">
.demo-form-image
  display: grid
  grid-template-columns: 1fr min-content
  gap: 1em

  .el-input-group__prepend
    min-width: var(--demo-form--label-min-width)
    text-align: center

  &__fullscreen
    text-align: center

  &__image
    display: inline-block
    position: relative

  &__trans
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-image: url('/media/sys/image/trans-background.jpg')
    filter: invert(0)
    transition: filter .3s ease-in-out

  &--dark &__trans
    filter: invert(1)

  &__switch
    display: block
    padding: 1em

  &__image-error
    padding: 2em
    font-weight: bold
    font-size: 1.5em
    color: black
    text-shadow: 1px 1px 5px white

  &--dark &__image-error
    color: white
    text-shadow: 1px 1px 5px black

</style>