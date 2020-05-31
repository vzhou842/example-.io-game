const Bullet = require('./bullet');
const Constants = require('../shared/constants');

const DIRECTION_UP = 0;
const DIRECTION_DOWN = Math.PI;

describe('Bullet', () => {
  describe('update', () => {
    it('should move at bullet speed', () => {
      const x = 1;
      const y = 2;
      const bullet = new Bullet('test-parent-id', x, y, DIRECTION_DOWN);

      expect(bullet).toEqual(expect.objectContaining({ y }));
      bullet.update(1);
      expect(bullet).toEqual(expect.objectContaining({ y: y + Constants.BULLET_SPEED }));
    });

    it('should be destroyed if it goes off the map', () => {
      const x = 1;
      const y = 1;
      const bullet = new Bullet('test-parent-id', x, y, DIRECTION_UP);

      expect(bullet.update(1)).toBe(true);
    });
    it('should not be destroyed if it stays on the map', () => {
      const x = 1;
      const y = 1;
      const bullet = new Bullet('test-parent-id', x, y, DIRECTION_DOWN);

      expect(bullet.update(1)).toBe(false);
    });
  });
});
