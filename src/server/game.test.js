const Game = require('./game');
const Constants = require('../shared/constants');

jest.useFakeTimers();

describe('Game', () => {
  it('should update the game on an interval', () => {
    const game = new Game();

    // Force the game to have been created in the past
    game.lastUpdateTime = Date.now() - 10;
    const initalCreatedTime = game.lastUpdateTime;

    jest.runOnlyPendingTimers();
    expect(game.lastUpdateTime).not.toEqual(initalCreatedTime);
  });

  it('should send updates on every second update', () => {
    const game = new Game();
    const socket = {
      id: '1234',
      emit: jest.fn(),
    };
    game.addPlayer(socket, 'guest');

    jest.runOnlyPendingTimers();
    expect(socket.emit).toHaveBeenCalledTimes(0);
    expect(game.shouldSendUpdate).toBe(true);

    jest.runOnlyPendingTimers();
    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledWith(Constants.MSG_TYPES.GAME_UPDATE, expect.any(Object));
    expect(game.shouldSendUpdate).toBe(false);
  });

  describe('handleInput', () => {
    it('should update the direction of a player', () => {
      const game = new Game();
      const socket = {
        id: '1234',
        emit: jest.fn(),
      };
      game.addPlayer(socket, 'guest');

      game.handleInput(socket, 2);

      // Run timers twice, as updates are only sent on every second call
      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();

      expect(socket.emit)
        .toHaveBeenCalledWith(
          Constants.MSG_TYPES.GAME_UPDATE,
          expect.objectContaining({
            me: expect.objectContaining({ direction: 2 }),
          }),
        );
    });
  });
});
