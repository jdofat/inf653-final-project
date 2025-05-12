require('dotenv').config();

const express = require('express');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;


connectDB();


app.use(express.json());


const statesRoutes = require('./routes/states');
app.use('/states', statesRoutes);


app.all('*', (req, res) => {
  if (req.accepts('html')) {
    res.status(404).send('<h1>404 Not Found</h1>');
  } else if (req.accepts('json')) {
    res.status(404).json({ error: '404 Not Found' });
  } else {
    res.status(404).type('txt').send('404 Not Found');
  }
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
