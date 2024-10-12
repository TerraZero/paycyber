<template lang="pug">
LayoutDemoPage(title="Create", :class="classes")
  ElForm.admin-demo-create__form
    DemoFormInput(v-model="label", label="Label")
    DemoFormSelect(v-model="type", label="Type", :options="fields.type.options")
    DemoFormSelect(v-model="group", label="Group", :options="groups", tagging)
    .admin-demo-create__image.admin-demo-create__form(v-if="type === 'image'")
      DemoFormInput(v-model="url", label="URL")
      .admin-demo-create__sidebar
        .admin-demo-create__left
          DemoFormSlider(v-model="scale", label="Scale", :min="0.5", :max="3", :step="0.1")
          DemoFormSlider(v-model="posx", label="Pos X", :min="-100", :max="100", :step="0.1")
          DemoFormSlider(v-model="posy", label="Pos Y", :min="-100", :max="100", :step="0.1")
          DemoFormSlider(v-model="rotate", label="Rotate", :min="0", :max="360", :step="90")
        .admin-demo-create__right
          ContentViewImage(:demo="true", :url="url", :scale="scale", :posx="posx", :posy="posy", :rotate="rotate")
    .admin-demo-create__music.admin-demo-create__form(v-if="type === 'music'")
      DemoFormInput(v-model="video", label="Video ID", @input="onVideo")
      .admin-demo-create__sidebar
        .admin-demo-create__left
          DemoFormSlider(v-model="volume", label="Volume", :min="0", :max="100")
          DemoFormInput(v-model="start", label="Start")
          DemoFormInput(v-model="end", label="End")
        .admin-demo-create__right
          #admin-demo-create__player
    .admin-demo-create__actions
      ElButton(type="primary", @click="onSubmit") Submit
      ElButton(@click="onCancel") Cancel

</template>

<script>
const YTPlayer = require('yt-player');
const Request = require('~/custom/frontend/Request');

export default {
  async asyncData() {
    const groups = await Request.create('demo/list/groups').deep('groups').GET();
    return { groups };
  },
  data() {
    return {
      fields: {
        type: {
          options: {
            image: 'Image',
            music: 'Music',
          },
        },
      },
      label: null,
      type: null,
      url: 'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg',
      scale: 1,
      posx: 0,
      posy: 0,
      rotate: 0,
      group: null,

      video: null,
      player: null,
      start: 0,
      end: -1,
      volume: 100,
    };
  },
  computed: {

    classes() {
      const classes = [];

      if (this.type) classes.push('admin-demo-create--type-' + this.type);
      return classes;
    },

  },
  methods: {

    async onSubmit() {
      let response = null;
      if (this.type === 'image') {
        response = await Request.create('demo/save').POST({
          entity: {
            label: this.label,
            type: this.type,
            group: typeof this.group === 'number' ? this.groups[this.group] : this.group,
            value: {
              url: this.url,
              scale: this.scale,
              posx: this.posx,
              posy: this.posy,
              rotate: this.rotate,
            },
          },
        });  
      } else {
        response = await Request.create('demo/save').POST({
          entity: {
            label: this.label,
            type: this.type,
            group: typeof this.group === 'number' ? this.groups[this.group] : this.group,
            value: {
              video: this.video,
              start: this.start,
              end: this.end,
              volume: this.volume,
            },
          },
        });
      }
      this.$router.push(`/admin/demo/${response.entity.id}/edit`);
    },

    onCancel() {
      this.$router.push('/admin/demo/list');
    },

    initPlayer() {
      this.player = new YTPlayer('#admin-demo-create__player', {
        autoplay: false,
      });
    },

    async onVideo() {
      if (this.player === null) this.initPlayer();
      this.player.load(this.video);
    },

  },
}
</script>
  
<style lang="sass">
.admin-demo-create

  &__form
    display: grid
    gap: 1em

  &__sidebar
    display: grid

  &--type-image &__sidebar
    grid-template-columns: 1fr 2fr

  &--type-music &__sidebar
    grid-template-columns: 1fr min-content

  &__left
    border: 1px solid white
    border-right: none
    padding: 1em
    display: flex
    flex-direction: column
    gap: 1em

  &--type-music &__right
    display: flex

  &__actions
    text-align: right

</style>