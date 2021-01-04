const Account = require("../models/account");

const getListUser = async () => {
  try {
    const result = await Account.find({ role: 0 });
    return { status: true, accounts: result };
  } catch (err) {
    return err;
  }
};

const getUserById = async (userId) => {
  try {
    const result = await Account.findOne({ _id: userId });
    return { status: true, account: result };
  } catch (err) {
    return err;
  }
};

const deactivateAccount = async (accountId) => {
  try {
    const findAccount = await Account.findOne({ _id: accountId });
    findAccount.isDeleted = true;
    Account.findOneAndUpdate({ _id: accountId }, findAccount, (err) => {
      if (err) {
        console.log(err);
        return { status: false, err: err };
      }
    });
    return { status: true, account: findAccount };
  } catch (err) {
    return err;
  }
};

const activateAccount = async (accountId) => {
  try {
    const findAccount = await Account.findOne({ _id: accountId });
    findAccount.isDeleted = false;
    Account.findOneAndUpdate({ _id: accountId }, findAccount, (err) => {
      if (err) {
        console.log(err);
        return { status: false, err: err };
      }
    });
    return { status: true, account: findAccount };
  } catch (err) {
    return err;
  }
};

const findAccount = async (keyword) => {
  try {
    const result = await Account.find({ role: 0, username: keyword, role: 0 });
    return { status: true, result: result };
  } catch (err) {
    return err;
  }
};

module.exports = {
  getListUser,
  deactivateAccount,
  activateAccount,
  getUserById,
  findAccount,
};
