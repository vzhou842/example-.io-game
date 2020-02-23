const Bullet = require('./bullet');
const Constants = require('../shared/constants');

describe('Bullet', () => {
  const directionUp = 0;
  const directionDown = Math.PI;

  describe('update', () => {
    it('should move at bullet speed', () => {
      const parentID = '123';
      const x = 1;
      const y = 2;
      const dir = directionDown;
      const bullet = new Bullet(parentID, x, y, dir);

      expect(bullet).toEqual(expect.objectContaining({ y }));
      bullet.update(1);
      expect(bullet).toEqual(expect.objectContaining({ y: y + Constants.BULLET_SPEED }));
    });

    it('should be destroyed if it goes off the map', () => {
      const parentID = '123';
      const x = 1;
      const y = 1;
      const dir = directionUp;
      const bullet = new Bullet(parentID, x, y, dir);

      expect(bullet.update(1)).toBe(true);
    });
    it('should not be destroyed if it stays on the map', () => {
      const parentID = '123';
      const x = 1;
      const y = 1;
      const dir = directionDown;
      const bullet = new Bullet(parentID, x, y, dir);

      bullet.update(1);

      expect(bullet.update(1)).toBe(false);
    });
  });
});
