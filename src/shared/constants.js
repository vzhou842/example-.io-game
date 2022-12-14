module.exports = Object.freeze({
  PLAYER_RADIUS: 30,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 400,          // 400
  PLAYER_FIRE_COOLDOWN: 0.5, // 0.25

  BULLET_RADIUS: 6,          // 3
  BULLET_SPEED: 800,        // 800
  BULLET_DAMAGE: 10,

  AID_KIT_RADIUS: 40,

  MAP_SIZE: 3000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
  },
});

