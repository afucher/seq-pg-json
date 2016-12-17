'use strict';

const Sequelize = require('sequelize');

let postgreSqlUrl = process.env.URL || 'postgres://postgres:postgres@localhost:5432/my_app',
    logging = process.env.LOG || false; 

let sequelize = new Sequelize(postgreSqlUrl,{
  logging //Change to 'true' to see sequelize queries
});

//Verify if sequelize is connected correctly
sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

//Define our Thing model
let Thing = sequelize.define('thing', {
  value: {
    type: Sequelize.DECIMAL
  },
  json_value: {
    type: Sequelize.JSON
  }
});

//-------------------------------------------------------

//Do the things!
Thing.sync({force: true}) //will drop the table if it already exists
  .then(populateDatabase)
  .then(() => Thing.findAll())
  .then(showThings);

//-------------------------------------------------------

//Populate our table with sample data
function populateDatabase(done){
  return Thing.bulkCreate([
    {value: 2.50, json_value:{a:"some",b:"thing"}},
    {value: 2.50, json_value:{a:"some",b:"one"}},
    {value: 2.50, json_value:{a:"some",b:"day"}}
  ])
}

//Output the information from json
function showThings(things){
  things.forEach(thing => console.log(thing.json_value.a + thing.json_value.b));
}
