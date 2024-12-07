module.exports = class RandomUtil {

  /**
   * @param {Object[]} options 
   * @param {CallableFunction} predicateWeight
   * @returns {number}
   */
  static getRandomOptionIndex(options, predicateWeight) {
    if (predicateWeight === undefined) predicateWeight = () => 1;
    const total = options.reduce((p, c) => p + predicateWeight(c), 1);
    let random = this.getRandomInt(1, total);
    for (const index in options) {
      random -= predicateWeight(options[index]);
      if (random < 1) {
        return index;
      }
    }
    return options.length - 1;
  }

  /**
   * @param {number} min 
   * @param {number} max 
   * @returns {number}
   */
  static getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
  }

  /**
   * @param {number} min 
   * @param {number} max 
   * @param {number} times
   * @returns {number[]}
   */
  static getRandomIntTimes(min, max, times = 1, allowMultiple = false) {
    if ((max - min + 1) < times) allowMultiple = true;
    const items = [];
    for (let i = 0; i < times; i++) {
      let number = this.getRandomInt(min, max);
      while (items.includes(number) && !allowMultiple) {
        number++;
        if (number > max) number = min;
      }
      items.push(number);
    }
    return items;
  }

  static generateSectors(count, size = 100) {
    let sectors = [];
    let totalRelativeSize = 0;

    // Berechne die relative Größe für jeden Sektor
    for (let i = 0; i < count; i++) {
        let sectorSize = Math.pow(2, i); // Größe des aktuellen Sektors (2^i)
        sectors.push(sectorSize);
        totalRelativeSize += sectorSize;
    }

    // Skaliere die Sektoren so, dass ihre Summe 100% ergibt
    return sectors.map(sector => (sector / totalRelativeSize) * size);
  }

  static generateSectorsInt(count, size = 100, min = 1) {
    return this.generateSectors(count, size).map(v => Math.max(min, Math.round(v)));
  }

  static shuffleArray(array, fixFirstItem = false) {
    const lastItem = array[array.length - 1];
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    // the last item before shuffle should not be the first item after shuffle
    if (fixFirstItem && array[0] === lastItem && array.length > 1) {
      const j = Math.floor(Math.random() * (array.length - 1)) + 1;
      [array[0], array[j]] = [array[j], array[0]];
    }
    return array;
  }

  static getRandomIndexArray(array) {
    return this.shuffleArray(Object.keys(array)).map(v => parseInt(v));
  }
 
}