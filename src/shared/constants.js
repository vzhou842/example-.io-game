module.exports = Object.freeze({
  PLAYER_RADIUS: 30,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 400,
  PLAYER_FIRE_COOLDOWN: 0.5,

  BULLET_RADIUS: 6,
  BULLET_SPEED: 800,
  BULLET_DAMAGE: 2,

  AID_KIT_RADIUS: 40,

  AFTER_DEATH_COUNTDOWN: 200,

  MAP_SIZE: 3000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
  },
});

