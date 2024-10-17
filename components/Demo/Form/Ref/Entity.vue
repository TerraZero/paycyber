<template lang="pug">
.demo-form-ref-entity(:class="classes")
  .demo-form-ref-entity__label {{ label }}
  .demo-form-ref-entity__content
    .demo-form-ref-entity__value-list(v-if="!loading")
      .demo-form-ref-entity__value(v-for="item, index in value", :key="item.group")
        .demo-form-ref-entity__controls
          ElButtonGroup
            ElButton(v-if="addon", size="mini", icon="el-icon-edit", @click="onEdit(index)")
            ElButton(size="mini", type="danger", icon="el-icon-delete", @click="onDelete(index)")
        DemoViewEntity(:entity="entities[index]", :options="{light: true}")
        .demo-form-ref-entity__addon(v-if="addon")
          slot(:item="item")
    .demo-form-ref-entity__actions
      ElButton(v-if="allowAdd", type="primary", icon="el-icon-plus", @click="onAdd") Add Reference
  ElDialog(:visible.sync="open", width="90%", :close-on-click-modal="false", append-to-body)
    DemoFormInput.demo-form-ref-entity__filter(v-model="filter", label="Filter")
    .demo-form-ref-entity__list
      DemoViewEntity.demo-form-ref-entity__item(v-for="entity in list", :key="entity.values.group", :entity="entity", @click.native="onSelect(entity)")
</template>
  
<script>
import ActiveEntity from '~/custom/system/modules/controller/ActiveEntity';
  
export default {
  props: ['value', 'label', 'type', 'game', 'chain', 'max'],

  inject: {
    addon: {  
      default: false,
    },
  },

  watch: {
    value: {
      handler(newvalue) {
        this.load(newvalue);
      },
      immediate: true,
    },
  },

  data() {
    return {
      open: false,
      filter: '',
      items: [],
      loading: true,
      entities: [],
    };
  },

  computed: {

    classes() {
      const classes = [];
      
      if (this.addon) classes.push('addon');
      return classes.map(v => 'demo-form-ref-entity--' + v);
    },

    list() {
      const items = this.items ?? [];

      return items.filter(v => {
        if (this.filter) {
          if (this.filter && !(v.values.label.includes(this.filter) || v.values.group.includes(this.filter))) return false;
        }
        if (this.getIds().includes(v.values.group)) return false;
        return true;
      }).sort((a, b) => {
        return b.values.label.localeCompare(a.values.label);
      });
    },

    allowAdd() {
      if (this.max !== undefined) {
        return this.value.length < this.max;
      }
      return true;
    },

  },

  methods: {

    async load(values) {
      this.loading = true;
      this.entities = [];
      for (const item of values) {
        this.entities.push(await ActiveEntity.single('Demo', {
          game: item.game,
          type: item.type,
          group: item.group,
        }));
      }
      this.loading = false;
    },

    async dialogOpen() {
      this.items = await ActiveEntity.multi('Demo', {
        game: this.game,
        type: this.type,
      });
      this.open = true;
    },

    onAdd() {
      this.dialogOpen();
    },

    onSelect(entity) {
      const value = this.getValue();
      value.push(this.getItem(entity));
      this.doInput(value);
      this.open = false;
      if (this.chain !== undefined && this.addon) {
        this.onEdit(value.length - 1);
      }
    },

    getEntity(item) {
      return ActiveEntity.single('Demo', {
        game: item.game,
        type: item.type,
        group: item.group,
      });
    },

    getItem(entity) {
      return {
        game: entity.values.game,
        type: entity.values.type,
        group: entity.values.group,
      };
    },

    getIds() {
      const ids = [];
      for (const item of this.value) {
        ids.push(item.group);
      }
      return ids;
    },

    getValue() {
      return JSON.parse(JSON.stringify(this.value));
    },

    doInput(value) {
      this.$emit('input', value);
    },

    onEdit(index) {
      this.addon.onEdit(index);
    },

    onDelete(index) {
      const value = this.getValue();
      value.splice(index, 1);
      this.doInput(value);
    },

  },

};
</script>

<style lang="sass">
.demo-form-ref-entity
  background: #282828
  border-radius: var(--element-radius)
  color: white
  word-break: normal

  &__filter
    padding-bottom: 1em

  &__value-list,
  &__list
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(150px, 200px))
    gap: 1em
    padding-bottom: 1em

  &__item
    padding: 1em
    box-sizing: border-box
    position: relative
    cursor: pointer

  &__item:hover:after
    content: ''
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: rgba(0, 0, 0, .2)

  &__value
    position: relative
    padding: .5em
    border-radius: var(--element-radius)
    background: #333

  &__controls
    text-align: right
    position: absolute
    bottom: 0
    right: 0
    padding: .5em
    background: #222
    z-index: 1
    opacity: 0
    border-radius: var(--element-radius)
    transition: opacity .2s ease-in-out

  &__value:hover &__controls
    opacity: 1

  &__label
    background: #222
    padding: .5em 1em
    color: white
    border-radius: var(--element-radius--top)
    font-weight: bold
    font-size: 1.2em

  &__content
    padding: 1em

</style>