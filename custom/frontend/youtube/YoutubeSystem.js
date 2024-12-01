/**
 * @typedef {Object} T_YoutubeSystemConfig
 * @property {Element} container
 */

const YTPlayer = require('yt-player');

module.exports = class YoutubeSystem {

  /**
   * @param {import('../SoundSystem')} system 
   * @param {T_YoutubeSystemConfig} config
   */
  constructor(system, config) {
    this.system = system;
    this.config = config;
    this.player = new YTPlayer(this.config.container);
    this.current = null;
    this.loaded = false;
    this.playing = false;

    this.player.on('cued', () => {
      this.loaded = true;
    });

    const callback = () => {
      this.system.events.emit('end', {
        trigger: 'end',
        item: this.current,
        plugin: 'youtube',
      });
    };
    this.player.on('ended', callback);
    this.player.on('playing', () => {
      this.playing = true;
    });
  }

  /**
   * @param {string} prop 
   */
  onChange(prop) {
    if (prop === 'volume') {
      const itemVolume = this.current?.config?.volume ?? 1;
      this.player.setVolume(itemVolume * 100 * this.system.volume());
    }
  }

  /**
   * @param {import('../SoundSystem').T_SoundItem} item 
   * @returns {import('../SoundSystem').T_SoundItem}
   */
  load(item) {
    if (this.current?.path !== item.path) {
      this.current = item;
      this.loaded = false;
      this.playing = false;
      this.player.load(item.path);
    } else {
      this.current = item; 
    }
    return item;
  }

  /**
   * @param {import('../SoundSystem').T_SoundItem} item 
   * @param {import('../SoundSystem').T_SoundConfig} config 
   * @returns {import('../SoundSystem').T_SoundItem}
   */
  play(item, config = null) {
    if (config !== null) {
      item.config = config;
    }
    this.load(item);
    if (this.isPlaying()) {
      this.loadConfig(item);
    } else if (this.loaded) {
      this.loadConfig(item);
      this.playing = true;
      this.player.play();
    } else {
      this.player.once('cued', () => {
        this.play(item);
      });
    }
    return item;
  }

  /**
   * @param {import('../SoundSystem').T_SoundItem} item 
   * @returns {import('../SoundSystem').T_SoundItem}
   */
  stop(item = null) {
    if (this.isPlaying()) {
      this.playing = false;
      this.player.pause();
      this.system.events.emit('end', {
        trigger: 'end',
        item: this.current,
        plugin: 'youtube',
      });
    }
    return item;
  }

  /**
   * @param {import('../SoundSystem').T_SoundItem} item 
   * @returns {import('../SoundSystem').T_SoundItem}
   */
  loadConfig(item) {
    if (item.config) {
      if (!this.isPlaying()) {
        this.player.seek(item.config.start ?? 0);
        if (item.config.end) {
          setTimeout(() => {
            this.stop(item);
          }, (item.config.end - item.config?.start ?? 0) * 1000);
        }
      }
      this.onChange('volume');
    }
    return this;
  }

  isPlaying() {
    return this.playing;
  }

}

