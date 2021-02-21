const guild = new mongoose.Schema({
  username: { type: String, required: true },
  discordGuildID: { type: String, required: false },
  discordChannelID: { type: String, required: false },
  members: { type: [String], required: false },
  allycodes: { type: [String], required: false },
  ownerID: { type: String, required: true },
  inviteToken: { type: String, required: true },
});

const Guild = (module.exports = mongoose.model("Guild", guild));
