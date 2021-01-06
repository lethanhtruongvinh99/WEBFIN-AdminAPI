const Message = require("../models/message");

const getMessageByGame = async (Game) => {
  try {
    const result = await Message.find({
      belongTo: Game.belongTo,
      isCreatedAt: { $lte: Game.endAt },
      isCreatedAt: { $gte: Game.isCreatedAt },
    });
    return { stauts: true, msgs: result };
  } catch (err) {
    return err;
  }
};


module.exports = { getMessageByGame };
