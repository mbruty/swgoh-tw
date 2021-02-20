const mongoose = require("mongoose");
export default mongoose.connect(process.env.MONGO_CONN_STRING, {
  useNewUrlParser: true,
});
