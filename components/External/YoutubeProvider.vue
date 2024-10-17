<template lang="pug">
.external-youtube-provider
  .external-youtube-provider__video(ref="video")
</template>

<script>
import YTPlayer from 'yt-player';

export default {

  props: {
    id: {
      type: String, 
      required: true,
    },
  },

  data() {
    return {
      video: null,
    };
  },

  methods: {

    player() {
      if (this.video === null) {
        this.video = new YTPlayer(this.$refs.video);
        this.video.setVolume(100);
      }
      return this.video;
    },

    load() {
      this.player().load(this.id);
    },

  },

}
</script>
  
<style lang="sass">

</style>