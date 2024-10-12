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
      if (this.hasListener('save')) {
        this.$emit('save', entity);
      } else {
        this.pack(entity);
        this.base.save(entity);
      }
    },

    pack(entity) {

    },

    unpack(entity) {

    },

  },

};