<template lang="pug">
.page-test-map
  DemoMapGrid(:image="image", :width="width", :height="height", :top="top", :left="left", :right="right", :bottom="bottom")
</template>

<script>
export default {
  data() {
    return {
      image: 'https://steamuserimages-a.akamaihd.net/ugc/946216444299817579/FDEC8B2570FC1AC260A10CBD3FC2502A7F0D0235/?imw=2048&imh=1321&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
      width: 30,
      height: 19,
      top: '5px',
      left: '3px',
      right: '3px',
      bottom: '39px',
    };
  },
}
</script>

<style lang="sass">
.page-test-map
  width: 100vw
  height: 100vh
  overflow: hidden
</style>