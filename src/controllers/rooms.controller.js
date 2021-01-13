const Room = require("./../models/room");

const getRoomDetail = async (id) => {
  try {
    const result = await Room.findOne({ _id: id });
    return { status: true, data: result };
  } catch (err) {
    return { status: false, err: err };
  }
};

const getRoomByUserId = async (id) => {
  try {
    const created = await Room.find({ "createdBy._id": id });
    const player = await Room.find({"playerB._id": id});
    const result = [...created, ...player]
    return { status: true, data: result };
  } catch (err) {
    return { status: false, data: err };
  }
};

const getAllRoom = async () => {
  try {
    const result = await Room.find();
    return { status: true, data: result };
  } catch (err) {
    return { status: false, data: err };
  }
};

module.exports = { getRoomDetail, getRoomByUserId, getAllRoom };
