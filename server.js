require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

 const authRoutes = require('./routes/authRoutes');
  const bookRoutes = require('./routes/bookRoutes');    
  const requestRoutes = require('./routes/requestRoute');
   const path = require('path');

const app = express();

connectDB();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));


app.use('/api', authRoutes);
 app.use('/api', bookRoutes);
 app.use('/api', requestRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
