'user restrict';
const Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/my_app',{
  logging: false
});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

var Thing = sequelize.define('thing', {
  value: {
    type: Sequelize.DECIMAL
  },
  json_value: {
    type: Sequelize.JSON
  }
});

// force: true will drop the table if it already exists
Thing.sync({force: true})
  .then(populateDatabase)
  .then(() => Thing.findAll())
  .then(showThings);

function populateDatabase(done){
  return Thing.bulkCreate([
    {value: 2.50, json_value:{a:"some",b:"thing"}},
    {value: 2.50, json_value:{a:"some",b:"one"}},
    {value: 2.50, json_value:{a:"some",b:"day"}}
  ])
}

function showThings(things){
  things.forEach(thing => console.log(thing.get("json_value").a + thing.get("json_value").b));
}
