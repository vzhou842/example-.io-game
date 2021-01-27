module.exports = Object.freeze({
  PLAYER_RADIUS: 20,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 200,
  PLAYER_FIRE_COOLDOWN: 0.25,
  PLAYER_HP_RECOVERY_RATE: 1,

  BULLET_RADIUS: 3,
  BULLET_SPEED: 200,
  BULLET_DAMAGE: 10,

  SCORE_BULLET_HIT: 20,
  SCORE_PER_SECOND: 1,

  SMAP_SIZE: 100,

  MAP_SIZE: 3000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT_MOVE: 'input_move',
    INPUT_FIRE: 'input_fire',
    INPUT_DIRECTION: 'input_dir',
    INPUT_TOGGLE: 'input_toggle',
    GAME_OVER: 'dead',
  },
});
