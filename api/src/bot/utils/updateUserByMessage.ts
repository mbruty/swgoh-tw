const UserModel = require("../../models/user");

const updateUserByMessage = async (message, data) => {
  await UserModel.updateOne({ id: message.author.id }), data;
};

export default updateUserByMessage;
