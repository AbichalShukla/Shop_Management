const mongoose = require('mongoose');
 const MONGO_URI = "mongodb://localhost:27017/ShopManage"
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
module.exports = connectDB;
