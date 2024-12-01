/**
 * @typedef {Object} T_SoundConfig
 * @property {number} [volume]
 * @property {number} [start]
 * @property {number} [end]
 */

/**
 * @typedef {Object} T_SoundItem
 * @property {string} path
 * @property {string} plugin
 * @property {(string|number)} [id]
 * @property {T_SoundConfig} [config]
 */

const Handler = require('events');
const HowlerSystem = require('./howler/HowlerSystem');
const YoutubeSystem = require('./youtube/YoutubeSystem');
const JukeBox = require('./util/JukeBox');

module.exports = class SoundSystem {

  static get() {
    if (this._instance === undefined) {
      this._instance = new SoundSystem();
    }
    return this._instance;
  }

  /**
   * @param {Element} container 
   */
  static initYoutube(container) {
    if (!this.get().hasPlugin('youtube')) {
      this.get().addPlugin('youtube', new YoutubeSystem(this.get(), {
        container,
      }));
    }
  }

  /**
   * @param {T_SoundItem} item 
   * @returns 
   */
  static load(item) {
    return this.get().load(item);
  }

  /**
   * @param {T_SoundItem} item 
   * @param {T_SoundConfig} config
   * @returns 
   */
  static play(item, config = null) {
    return this.get().play(item, config);
  }

  /**
   * @param {T_SoundItem} item 
   * @returns {boolean}
   */
  static isPlaying(item) {
    return this.get().isPlaying(item);
  }

  /**
   * @param {T_SoundItem} item 
   * @returns 
   */
  static stop(item = null) {
    return this.get().stop(item);
  }

  /**
   * @param {number} volume 
   * @returns {(number|this)}
   */
  static volume(volume = null) {
    return this.get().volume(volume);
  }

  static playlist(playlist, config = {}) {
    this.get().playlist(playlist, config);
  }

  constructor() {
    this._plugins = {};
    this.config = {};
    this.events = new Handler();
    this._playlist = new JukeBox();

    this.events.on('end', event => {
      if (event.item?.data?.playlist) {
        this.next();
      }
    }); 

    this.addPlugin('howler', new HowlerSystem(this));
  }

  addPlugin(name, plugin) {
    if (this.hasPlugin(name)) {
      throw new Error(`The plugin "${name}" already exist.`);  
    }
    this._plugins[name] = plugin;
  }

  hasPlugin(name) {
    return this._plugins[name] !== undefined;
  }

  getPlugin(name) {
    if (this.hasPlugin(name)) {
      return this._plugins[name];
    }
    throw new Error(`The plugin "${name}" is unknown.`);
  }

  /**
   * @param {T_SoundItem} item 
   * @returns 
   */
  load(item) {
    return this.getPlugin(item.plugin).load(item);
  }

  /**
   * @param {T_SoundItem} item 
   * @param {T_SoundConfig} config
   * @returns 
   */
  play(item, config = null) {
    return this.getPlugin(item.plugin).play(item, config);
  }

  /**
   * @param {T_SoundItem} item 
   * @returns {boolean}
   */
  isPlaying(item) {
    return this.getPlugin(item.plugin).isPlaying(item);
  }

  /**
   * @param {T_SoundItem} item 
   * @returns 
   */
  stop(item = null) {
    if (item === null) {
      for (const id in this._plugins) {
        this._plugins[id].stop();
      }
      return null;
    }
    return this.getPlugin(item.plugin).stop(item);
  }

  /**
   * @param {string} prop
   */
  onChange(prop) {
    for (const plugin in this._plugins) {
      this._plugins[plugin].onChange(prop);
    }
  }

  /**
   * @param {number} volume 
   * @returns {(number|this)}
   */
  volume(volume = null) {
    if (volume === null) {
      return this.config.volume ?? 1;
    } else {
      this.config.volume = volume;
      this.onChange('volume');
      return this;
    }
  }

  playlist(playlist, config = {}) {
    this._playlist
      .setLoop(config.loop ?? false)
      .setShuffle(config.shuffle ?? false)
      .setItems(playlist);
    this.next();
  }

  next() {
    const current = this._playlist.current();
    if (current !== null) {
      this.stop(current);
    }
    const next = this._playlist.next();
    if (next !== null) {
      next.data = {
        playlist: true,
      };
      this.play(next);
    }
  }

}