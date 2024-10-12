<template lang="pug">
.demo-form-compose-items
  .demo-form-compose-items__item(v-for="item, iindex in value", :key="iindex")
    .demo-form-compose-items__heading
      DemoFormInput(label="ID", v-model="item.id")
      ElButton(type="danger", icon="el-icon-delete", @click="deleteItem(iindex)")
    DemoFormInput(label="Label", v-model="item.label")
    DemoFormInput(label="Gewichtung", v-model="item.weight")
    DemoFormInput(label="Robustheit", v-model="item.tough")
    DemoFormRefCategory(label="Category", v-model="item.cat")
  ElButton(type="primary", icon="el-icon-plus", @click="addItem") Add Item
</template>
  
<script>  
export default {
  props: ['value', 'options'],

  methods: {

    setValue(value) {
      this.$emit('input', value);
    },

    addItem() {
      this.value.push({
        id: '',
        label: '',
        weight: 1,
        tough: 1,
        cat: '',
        modis: [],
      });
      this.setValue(this.value);
    },

    deleteItem(index) {
      this.value.splice(index, 1);
      this.setValue(this.value);
    },

  },

};
</script>

<style lang="sass">
.demo-form-compose-items
  padding: 1em
  border: 1px solid #111

  &, &__items, &__item
    display: grid
    grid-template-columns: 1fr
    gap: 1em

  &__heading
    display: grid
    grid-template-columns: 1fr min-content
    gap: 1em

  &__item
    padding: .5em
    border: 1px solid #111

</style>