module.exports = {

  computed: {

    base() {
      return this.$refs.base;
    },

  },

  methods: {
 
    hasListener(event) {
      return this.$listeners && this.$listeners[event];
    },

    open(entity = null) {
      this.base.open(entity);
    },

    close() {
      this.base.close();
    },

    onClose() {
      if (this.hasListener('close')) {
        this.$emit('close', this);
      } else {
        this.close();
      }
    },

    onDelete(entity) {
      if (this.hasListener('delete')) {
        this.$emit('delete', entity);
      } else {
        this.base.delete(entity);
      }
    },

    onFinish(event) {
      this.$emit('finish', event);
    },

    onLoad(entity) {
      this.entity = entity;
      this.unpack(entity);
    },

    onSave(entity) {
      let reason = null;
      this.pack(entity);
      if (typeof (reason = this.validate(entity)) === 'string') {
        if (this.hasListener('invalid')) {
          this.$emit('invalid', {
            entity,
            reason,
          });
        } else {
          this.$message.error(reason);
        }
        return;
      }
      if (this.hasListener('save')) {
        this.$emit('save', entity);
      } else {
        this.pack(entity);
        this.base.save(entity);
      }
    },

    /**
     * @param {import('~/custom/system/modules/controller/ActiveEntity')} entity 
     * @returns {(boolean|string)}
     */
    validate(entity) {
      if (typeof entity.values.label !== 'string' || entity.values.label.length === 0) {
        return 'The label is required.';
      }
      if (typeof entity.values.group !== 'string' || entity.values.group.length === 0) {
        return 'The id (group) is required.';
      }
      return true;
    },

    pack(entity) {

    },

    unpack(entity) {

    },

  },

};