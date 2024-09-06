const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://kequetrac:WZErWZuKLQOvCHqn@cluster.5bh1r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster";

async function connect() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect successfully to mongoDB!!!");
  } catch (error) {
    console.log("Connect failure!!!", error);
  }
}

module.exports = { connect };
