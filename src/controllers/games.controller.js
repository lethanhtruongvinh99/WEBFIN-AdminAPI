const Game = require("../models/game");

const getListGame = async () => {
  try {
    const result = await Game.find({ winner: null });
    return { status: true, games: result };
  } catch (err) {
    return err;
  }
};

const getGameById = async (gameId) => {
  try {
    const result = await Game.findOne({ _id: gameId });
    return { status: true, game: result };
  } catch (err) {
    return err;
  }
};

const getListGameByUserId = async (accountId) => {
  try {
    const result = await Game.find({
      winner: null,
      $or: [{ playerA: accountId }, { playerB: accountId }],
    });
    return { staus: true, games: result };
  } catch (err) {
    return err;
  }
};

module.exports = { getListGame, getGameById, getListGameByUserId };
