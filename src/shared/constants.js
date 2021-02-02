module.exports = Object.freeze({
  PLAYER_RADIUS: 20,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 120,
  PLAYER_FIRE_COOLDOWN: 0.5,
  PLAYER_HP_RECOVERY_RATE: 1,
  PLAYER_COLLISION_COOLDOWN: 1,

  BULLET_RADIUS: 15,
  BULLET_SPEED: 180,
  BULLET_DAMAGE: 10,

  SCORE_BULLET_HIT: 20,
  SCORE_PER_SECOND: 0.5,

  SMAP_SIZE: 100,

  MAP_SIZE: 6000,
  MAP_GRID_SIZE: 100,
  MAP_OBJ_GRID_SIZE: 50,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    UPDATE_CANVAS_SIZE: 'update_canvas_size',
    INPUT_MOVE: 'input_move',
    INPUT_FIRE: 'input_fire',
    INPUT_DIRECTION: 'input_dir',
    INPUT_TOGGLE: 'input_toggle',
    GAME_OVER: 'dead',
  },
});
