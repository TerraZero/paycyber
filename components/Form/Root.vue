<template lang="pug">
form.form-root(:class="classes")
  FormError(id=".")
  FormGroup.form-root__group(ref="group", :schema="schema", :value="value", :root="true", :id="''", @input="onInput")
</template>

<script>
import Debug from './Debug.mixin';

export default {
  mixins: [Debug],
  props: {
    schema: {
      type: Object,
      required: true,
    },
    value: {
      required: true,
    },
    state: {
      type: Object,
      required: true,
    },
    ui: {
      type: String,
      default: 'simple',
    },
  },
  watch: {
    state: function(state) {
      this.$emit('changeState', this, state);
    },
  },
  provide() {
    return {
      formRoot: this,
      form: this,
    };
  },
  data() {
    return {
      proxyState: this.state,
    };
  },
  computed: {
    classes() {
      const classes = [];

      if (this.ui) classes.push('form-root--ui-' + this.ui);
      return classes;
    },
    group() {
      return this.$refs.group;
    },
  },
  methods: {
    getFieldType() {
      return 'form';
    },
    getFieldDataType() {
      return 'object';
    },
    onInput(value) {
      this.$emit('input', value);
    },
    setError(id, message, index = null) {
      if (index) id = id + '.' + index;
      let found = this.proxyState.errors.findIndex(v => v.id === id);
      if (found === -1) {
        found = this.proxyState.errors.length;
        this.proxyState.errors.push({
          id,
          messages: []
        });
      }
      this.proxyState.errors[found].messages.push(message);
      this.$emit('update:state', this.proxyState);
    },
    getErrors(id) {
      return this.state.errors?.find(v => v.id === id)?.messages;
    },
    formValidate(state = null) {
      this.proxyState = state || this.proxyState;
      this.proxyState.errors = [];
      this.group.formValidate(this, this.proxyState);
      this.$emit('update:state', this.proxyState);
      this.$emit('changeState', this, this.proxyState);
    },
    formSubmit() {
      this.formValidate();
      console.log('formSubmit', this.state);
    },
    doSubmit(trigger) {
      this.$emit('form:submit', {
        state: this.state,
        value: this.value,
        trigger,
      });
    },
  },
};
</script>

<style lang="sass">
.el-input-group__prepend
  background: #222
  color: white
  border-color: #222

.el-input__inner
  border-color: #333

</style>