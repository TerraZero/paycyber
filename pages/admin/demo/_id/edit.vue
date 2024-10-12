<template lang="pug">
LayoutDemoPage(:title="'Edit ' + label", :class="classes")
  ElForm.admin-demo-create__form
    DemoFormInput(:value="id", label="ID")
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
      ElButton(type="danger", @click="onDelete") Delete

</template>

<script>
const YTPlayer = require('yt-player');
const Request = require('~/custom/frontend/Request');

export default {
  async asyncData({ params }) {
    const groups = await Request.create('demo/list/groups').deep('groups').GET();
    const entity = await Request.create(`demo/${params.id}/load`).deep('item').GET();

    if (entity.type === 'image') {
      return { 
        groups: groups,
        id: entity.id,
        label: entity.label,
        type: entity.type,
        group: entity.group,
        posx: entity.value.posx,
        posy: entity.value.posy,
        scale: entity.value.scale,
        rotate: entity.value.rotate,
        url: entity.value.url,
      };
    } else {
      return { 
        groups: groups,
        id: entity.id,
        label: entity.label,
        type: entity.type,
        group: entity.group,
        video: entity.value.video,
        start: entity.value.start,
        end: entity.value.end,
        volume: entity.value.volume,
      };
    }
  },
  mounted() {
    if (this.type === 'music') {
      setTimeout(() => {
        this.onVideo();
      }, 500);
    }
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
      id: null,
      label: null,
      type: null,
      url: null,
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
      await Request.create('demo/save').POST({
        entity: {
          id: this.id,
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
      this.onCancel();
    },

    onCancel() {
      this.$router.push('/admin/demo/list');
    },

    async onDelete() {
      try {
        await this.$confirm('Are you sure to delete this content?', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          confirmButtonClass: 'el-button--danger',
        });
        await Request.create('demo/delete').POST({
          id: this.id,
        });
        this.onCancel();
      } catch (e) { }
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