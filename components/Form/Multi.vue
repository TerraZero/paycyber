<template lang="pug">
.form-multi
  .form-multi__item(v-for="index in length", :key="index")
    slot(:value="getValue(index - 1)", :id="id + '.' + (index - 1)", :index="index - 1", :single="isSingle", :onInput="toBag(doInput, { index: index - 1 })", :getLabel="toBag(getLabel, { index: index - 1 })")
    .form-multi__item-controls
      ElButton(type="danger", icon="el-icon-delete", size="small", @click="onDelete(index - 1)")
  .form-multi__controls
    ElButton(v-if="isAdd", type="default", icon="el-icon-plus", size="small", @click="onAdd") {{ getControlText('add') }}
</template>
  
<script> 
import Util from '~/custom/system/modules/utils/Util';
import Debug from './Debug.mixin';
import Vue from 'vue';

export default {
  mixins: [Debug],
  props: {
    value: {},
    id: {
      type: String,
      required: true,
    },
    schema: {
      type: Object,
      required: true,
    },
  },
  watch: {
    value(value) {
      this.proxy = value ?? this.getEmpty();
    },
  },
  data() {
    return {
      proxy: this.value ?? this.getEmpty(!this.schema.multi || this.schema.multi.length === 1),
    };
  },
  computed: {
    multi() {
      return this.schema.multi;
    },
    length() {
      if (this.isSingle) return 1;
      if (this.multi.length === -1 || this.multi.compact) {
        return this.proxy.length || 1;
      } else {
        return this.multi.length;
      }
    },
    maxLength() {
      return this.isSingle ? 1 : this.multi.length;
    },
    isSingle() {
      return !this.multi || this.multi.length === 1;
    },
    isAdd() {
      return !this.isSingle && (this.multi.compact && this.proxy.length < this.maxLength || this.maxLength === -1);
    },
  },
  methods: {
    getControlText(key) {
      if (this.multi.controls && this.multi.controls[key]) return this.multi.controls[key];
      if (key === 'add') return 'Add item';
    },
    getEmpty(isSingle) {
      return (this.isSingle || isSingle) ? null : [null];
    },
    getValue(index) {
      if (this.isSingle) return this.proxy;
      return this.proxy[index] || null;
    },
    getLabel(bag, label) {
      if (this.isSingle) {
        return Util.template(label, {
          index0: '',
          index: '',
        });
      } else {
        if (this.multi.label) {
          return Util.template(this.multi.label, {
            index0: bag.index,
            index: bag.index + 1,
          });
        }
        const check = Util.template(label, {
          index0: bag.index,
          index: bag.index + 1,
        });
        if (check !== label) return check;
        return Util.template(label + ' ${index}', {
          index0: bag.index,
          index: bag.index + 1,
        });
      }
    },
    doInput(bag, value) {
      if (this.isSingle) {
        this.$emit('input', value);
      } else {
        for (let i = this.proxy.length; i < bag.index; i++) this.proxy.push(null);
        Vue.set(this.proxy, bag.index, value);
        this.$emit('input', this.proxy);
      }
    },
    toBag(target, bag) {
      return (...args) => {
        return target(bag, ...args);
      };
    },
    onDelete(index) {
      if (this.isAdd) {
        this.proxy.splice(index, 1);
        this.$emit('input', this.proxy);
      } else {
        this.doInput({ index }, null); 
      }
    },
    onAdd() {
      if (this.proxy.length === 0) {
        this.proxy.push(null);
      }
      this.proxy.push(null);
      this.$emit('input', this.proxy);
    },
  },
};
</script>

<style lang="sass">
.form-multi

  &__item-controls
    margin-top: .5em
    text-align: right

</style>