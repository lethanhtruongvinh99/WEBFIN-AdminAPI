const Room = require("./../models/room");

const getRoomDetail = async (id) => {
  try {
    const result = await Room.findOne({ _id: id });
    return { status: true, data: result };
  } catch (err) {
    return { status: false, err: err };
  }
};

module.exports = { getRoomDetail };
