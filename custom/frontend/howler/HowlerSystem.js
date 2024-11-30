const HowlerItem = require('./HowlerItem');

module.exports = class HowlerSystem {

  /**
   * @param {import('../SoundSystem')} system 
   */
  constructor(system) {
    this.system = system;
    this._items = {};
  }

  /**
   * @param {string} prop 
   */
  onChange(prop) {
    for (const id in this._items) {
      this._items[id].onChange(prop);
    }
  }

  /**
   * @param {import('../SoundSystem').T_SoundItem} item 
   * @returns {HowlerItem}
   */
  item(item) {
    const id = HowlerItem.id(item);
    if (!this._items[id]) {
      this._items[id] = new HowlerItem(this, item);
    }
    return this._items[id];
  }

  /**
   * @param {import('../SoundSystem').T_SoundItem} item 
   * @returns {import('../SoundSystem').T_SoundItem}
   */
  load(item) {
    const howl = this.item(item);

    howl.load();
    return howl;
  }

  /**
   * @param {import('../SoundSystem').T_SoundItem} item 
   * @param {import('../SoundSystem').T_SoundConfig} config
   * @returns {import('../SoundSystem').T_SoundItem}
   */
  play(item, config = null) {
    const howl = this.item(item);
    
    howl.play(config);
    return howl;
  }

  /**
   * @param {import('../SoundSystem').T_SoundItem} item 
   * @returns {import('../SoundSystem').T_SoundItem}
   */
  stop(item) {
    const howl = this.item(item);
    
    howl.stop();
    return howl;
  }

  /**
   * @param {import('../SoundSystem').T_SoundItem} item 
   * @returns {boolean}
   */
  isPlaying(item) {
    return this.item(item).isPlaying();
  }

}

