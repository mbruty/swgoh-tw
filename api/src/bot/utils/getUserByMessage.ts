const UserModel = require("../../models/user");

const getUserByMessage = async (message) => {
  return await UserModel.findOne({ id: message.author.id });
};

export default getUserByMessage;
