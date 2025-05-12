require('dotenv').config();
const mongoose = require('mongoose');
const State = require('./models/State');
const connectDB = require('./config/dbConn');

const seedData = [
  {
    stateCode: 'KS',
    funfacts: [
      'Kansas has the world\'s largest ball of twine in Cawker City.',
      'The first Pizza Hut opened in Wichita, Kansas, in 1958.',
      'Helium was discovered in natural gas in Kansas in 1905.'
    ]
  },
  {
    stateCode: 'MO',
    funfacts: [
      'The ice cream cone was popularized at the 1904 World’s Fair in St. Louis.',
      'Missouri is home to the most extensive cave system in the U.S., with over 6,000 caves.',
      'The Gateway Arch is the tallest man-made national monument in the U.S.'
    ]
  },
  {
    stateCode: 'OK',
    funfacts: [
      'The parking meter was invented in Oklahoma City in 1935.',
      'Oklahoma has more man-made lakes than any other state—over 200.',
      'The state capitol building has an oil well directly underneath it.'
    ]
  },
  {
    stateCode: 'NE',
    funfacts: [
      'Kool-Aid was invented in Hastings, Nebraska, in 1927.',
      'Nebraska is the only state with a unicameral (one-house) legislature.',
      'The largest mammoth fossil ever found was discovered in Lincoln County, Nebraska.'
    ]
  },
  {
    stateCode: 'CO',
    funfacts: [
      'The world’s first rodeo was held in Deer Trail, Colorado, in 1869.',
      'Colorado has the highest average elevation of any U.S. state.',
      'The cheeseburger was trademarked in Denver in 1935.'
    ]
  }
];

const seedDB = async () => {
  await connectDB();
  await State.insertMany(seedData);
  console.log('facts!');
  mongoose.connection.close();
};

seedDB();
