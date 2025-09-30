const mongoose = require('mongoose');
 const MONGO_URI = "mongodb+srv://abichalshukla9963_db_user:shop@cluster0.qztbgwi.mongodb.net/"
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
