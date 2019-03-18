const mongoose = require('mongoose');

'use strict';

mongoose.connect('mongodb://localhost:27017/sandbox', {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error("connection error:", err);
});

const errorCheck = (err, message) => {
  if (err) console.error(message ? message + err : err);
}

db.once('open', () => {
  console.log('DB connection successful');
  // all db communication here
  const Schema = mongoose.Schema;
  const AnimalSchema = new Schema({
    type:  {type: String, default: 'goldfish'},
    color: {type: String, default: 'golden'},
    name:  {type: String, default: 'Angela'},
    size:  {type: String, default: 'small'},
    mass:  {type: Number, default: 0.007}
  });

  // create a model
  const Animal = mongoose.model('Animal', AnimalSchema);

  // create a document
  const elephant = new Animal({
    type: 'elephant',
    size: 'big',
    color: 'grey',
    mass: 6000,
    name: 'Lawrence' 
  });

  const animal = new Animal({}); // default goldfish

  const whale = new Animal({
    name: 'Wally',
    type: 'whale',
    size: 'big',
    mass: 190500
  })

  // using promises and `then` clauses
  // Animal.deleteMany()
  //   .then(() => elephant.save())
  //   .then(() => console.log('Saved elephant'))
  //   .then(() => animal.save())
  //   .then(() => console.log('Saved goldfish'))
  //   .then(() => db.close(() => console.log('db connection closed')))
  //   .catch(err => console.error(err));

  // using async/await
  async function run () {
    try {
      // remove all documents
      await Animal.deleteMany();
      console.log('deleted successfully');

      // save the animals
      await Promise.all([elephant.save(), animal.save(), whale.save()]);
      console.log('saved the animals');

      // list all the big animals
      await Animal.find({size: 'big'}, (err, results) => {
        results.forEach(animal => {
          console.log(`${animal.name} the ${animal.color} ${animal.type}`);
        });
      });

      // close the database
      db.close();
      console.log('db connection closed');
    } catch (err) {
      console.log(err);
      db.close()
    }
  };
  run();
});