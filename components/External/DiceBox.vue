<template lang="pug">
.external-dice-box(:class="'external-dice-box__' + id", @dicer-init="onDicerInit")
  script(v-if="!loading", type="module")
    .
      import DiceBox from '/assets/3d-dice/dice-box.es.min.js';

      const dicer = document.querySelector('.external-dice-box__{{ id }}');
      const box = new DiceBox('.external-dice-box__{{ id }}', {
        assetPath: '/assets/3d-dice/',
        gravity: 1,
        mass: 5,
        throwForce: 9,
        theme: 'blueGreenMetal',
      });

      box.init().then(() => {
        const event = new Event('dicer-init');

        event.DiceBox = DiceBox;
        event.box = box;
        event.canvas = dicer.querySelector('canvas');

        dicer.dispatchEvent(event);
      });
</template>

<script>
export default {
  props: {
    id: { required: true, type: String },
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
  data() {
    return {
      DiceBox: null,
      box: null,
      canvas: null,
      loading: true,
    };
  },
  methods: {
    onDicerInit({ DiceBox, box, canvas }) {
      this.DiceBox = DiceBox;
      this.box = box;
      this.canvas = canvas;
      this.$emit('init', this);
    },
  },
}
</script>

<style lang="sass">
.external-dice-box
  background-image: url("https://d3rivgcgaqw1jo.cloudfront.net/assets/woodgrain2.jpg")

  & > canvas
    width: 100%
    height: 100%
</style>