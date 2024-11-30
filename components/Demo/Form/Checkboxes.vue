<template lang="pug">
.demo-form-checkboxes(:class="classes")
  .demo-form-checkboxes__label {{ label }}
  .demo-form-checkboxes__group
    ElCheckbox.demo-form-checkboxes__checkbox(v-for="option, index in options", :key="index", v-model="value[index]", @input="onInput(index, $event)") {{ option }}
</template>
  
<script>  
export default {
  
  props: ['label', 'value', 'options', 'mode'],

  computed: {

    classes() {
      const classes = [];

      if (this.mode) classes.push(this.mode);
      return classes.map(v => 'demo-form-checkboxes--' + v);
    },

  },

  methods: {

    onInput(index, value) {
      this.value[index] = value;
      this.$emit('input', this.value);
    },

  },

};
</script>

<style lang="sass">
.demo-form-checkboxes
  display: flex

  &--props
    flex-wrap: wrap

  &__label
    background: #222
    white-space: nowrap
    font-size: 14px
    border-radius: var(--element-radius--left)
    color: var(--demo-form--label-color, white)
    padding: 12px 20px

  &--props &__label
    width: 100%
    border-radius: var(--element-radius--top)

  &__group
    display: flex
    gap: 1em
    justify-content: flex-start
    align-items: center
    padding: 0 1em
    box-sizing: border-box

  &--props &__group
    background: #282828
    width: 100%
    padding: 1em
    border-radius: var(--element-radius--bottom)

  &__checkbox
    margin: 0

  & .el-checkbox__label
    color: white

</style>