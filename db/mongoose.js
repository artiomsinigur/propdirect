const mongoose = require("mongoose");

// Connect and create new database propDirectDB
// Variable LOCAL_MONGODB_URI comes form mongolab and exactly is true for PORT
mongoose.connect(process.env.CLOUD_MONGODB_URI || process.env.LOCAL_MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
