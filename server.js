
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/dbConn');
const statesRoutes = require('./routes/states');

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());

connectDB();
console.log("ccc");

app.use(express.json());
console.log("ddd");
app.use(express.static('public'));


app.use('/states', statesRoutes);
console.log("f");

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.all('*path', (req, res) => { console.log("abc");
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

