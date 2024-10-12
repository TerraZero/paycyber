module.exports = {

  methods: {
    log(...args) {
      console.log('DEBUG:', ...args);
      if (args.length) return args.shift();
    },
  },

};