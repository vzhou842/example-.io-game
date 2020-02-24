const applyCollisions = require('./collisions');
const Constants = require('../shared/constants');
const Player = require('./player');
const Bullet = require('./bullet');

describe('applyCollisions', () => {
  it('should not collide when outside radius', () => {
    const distanceFromPlayer = Constants.BULLET_RADIUS + Constants.PLAYER_RADIUS + 1;
    const players = [
      new Player('1', 'guest1', 1000, 40),
      new Player('2', 'guest2', 2000, 2000),
    ];
    const bullets = [
      new Bullet('2', 1000 - distanceFromPlayer, 40, 0),
      new Bullet('2', 1000 + distanceFromPlayer, 40, 0),
    ];

    const result = applyCollisions(players, bullets);
    expect(result).toHaveLength(0);
  });

  it('should not collide with own player', () => {
    const playerId = '1234';
    const player = new Player(playerId, 'guest', 40, 40);
    const bullet = new Bullet(playerId, 40, 40, 0);

    const result = applyCollisions([player], [bullet]);
    expect(result).toHaveLength(0);
  });

  it('should apply damage when bullet collides with player', () => {
    const player = new Player('1', 'guest', 40, 40);
    const bullet = new Bullet('2', 40, 40 + Constants.BULLET_RADIUS + Constants.PLAYER_RADIUS, 0);

    jest.spyOn(player, 'takeBulletDamage');

    const result = applyCollisions([player], [bullet]);
    expect(result).toHaveLength(1);
    expect(result).toContain(bullet);
    expect(player.takeBulletDamage).toHaveBeenCalledTimes(1);
  });
});
