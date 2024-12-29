import EntityBase from '../EntityBase';

export default class TestEntity extends EntityBase {

  /**
   * @param {import('../collector/EntityCollector').default} collector
   */
  static define(collector) {
    collector.add('test', 'Test');
  }

  props() {
    return {
      name: {
        type: 'string',
        value: '',
      },
    };
  }

}