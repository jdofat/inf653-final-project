const mongoose = require("mongoose");

console.log("xxx");

const connectDB = async () => {
  try {
    console.log("sss");
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("vvv");
    console.error(err);
  }
};
console.log("eee");
module.exports = connectDB;
