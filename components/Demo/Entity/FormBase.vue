<template lang="pug">
ElDialog.demo-entity-form-base(:title="title", :visible.sync="dialog", width="90%", :close-on-click-modal="false", :class="classes")
  ElForm.demo-entity-form-base__form
    .demo-entity-form-base__fields
      slot
    .demo-entity-form-base__sidebar(v-if="$slots.sidebar")
      slot(name="sidebar")
  template(#footer)
    slot(name="actions")
      ElButton(type="primary", icon="el-icon-edit", @click="onSave") {{ deletable ? 'Save' : 'Create' }}
      ElButton(v-if="!more", icon="el-icon-more", @click="onMore")
      ElButton(v-if="more && deletable", type="danger", icon="el-icon-delete", @click="onDelete") Delete
      ElButton(v-if="more && deletable", icon="el-icon-document-copy", @click="onClone") Clone
      ElButton(v-if="more", icon="el-icon-close", @click="onClose") Close
</template>

<script>
const Request = require('~/custom/frontend/Request');
const RequestDemo = require('~/custom/frontend/RequestDemo');
const ActiveEntity = require('~/custom/system/modules/controller/ActiveEntity');

export default {
  props: {
    title: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      dialog: false,
      entity: null,
      more: false,
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.$slots.sidebar) classes.push('sidebar');
      return classes.map(v => 'demo-entity-form-base--' + v);
    },

    deletable() {
      return this.entity && !this.entity.isNew;
    },

  },
  
  methods: {

    hasListener(event) {
      return this.$listeners && this.$listeners[event];
    },

    open(entity = null) {
      if (entity === null) {
        this.setEntity(new ActiveEntity('Demo', {
          game: 'myz',
          type: this.type,
        }));
      } else {
        this.setEntity(entity);
      }
      this.more = false;
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    },

    onMore() {
      this.more = true;
    },

    setEntity(entity) {
      this.entity = entity;
      this.entity.values.value ??= {};
      this.$emit('load', this.entity);
    },

    onClone() {
      this.setEntity(new ActiveEntity('Demo', {
        game: 'myz',
        type: this.type,
        value: this.entity.values.value,
      }));
    },

    async onSave() {
      if (this.hasListener('save')) {
        this.$emit('save', this.entity);
      } else {
        await this.save();
      }
    },

    async save(entity) {
      RequestDemo.addLog('form.save', entity.values.type + ':' + entity.values.group, 'Save "' + entity.values.label + '"', entity.values);
      await entity.doSave();
      this.$emit('finish', {
        event: 'save',
        entity,
      });
    },

    onClose() {
      this.$emit('close', this.entity);
    },

    async onDelete() {
      if (this.hasListener('delete')) {
        this.$emit('delete', this.entity);
      } else {
        this.delete(this.entity);
      }
    },

    async delete(entity) {
      RequestDemo.addLog('form.delete', entity.values.type + ':' + entity.values.group, 'Delete "' + entity.values.label + '"', entity.values);
      await Request.create('schema/model/delete').POST({
        model: 'Demo',
        where: {
          game: 'myz',
          type: this.type,
          group: entity.values.group,
        },
      });
      this.$emit('finish', {
        event: 'delete',
        entity,
      });
    },

  },

};
</script>
  
<style lang="sass">
.demo-entity-form-base

  &__fields
    display: grid
    grid-template-columns: 1fr
    gap: 1em

  &--sidebar &__form
    display: grid
    grid-template-columns: 1fr max-content
    gap: 1em

  .el-dialog
    background: #333

  .el-dialog__title 
    color: white
</style>