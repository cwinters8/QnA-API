const mongoose = require('mongoose');

'use strict';

mongoose.connect('mongodb://localhost:27017/sandbox', {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error("connection error:", err);
});

const listAnimals = animals => {
  animals.forEach(animal => {
    console.log(`${animal.name} the ${animal.size} ${animal.color} ${animal.type}`);
  });
}

db.once('open', () => {
  console.log('DB connection successful');
  // all db communication here
  const Schema = mongoose.Schema;
  const AnimalSchema = new Schema({
    type:  {type: String, default: 'goldfish'},
    color: {type: String, default: 'golden'},
    name:  {type: String, default: 'Angela'},
    size:  String,
    mass:  {type: Number, default: 0.007}
  });

  // pre-hook middleware
  AnimalSchema.pre('save', function (next) {
    if (this.mass >= 100) {
      this.size = 'big';
    } else if (this.mass >= 5 && this.mass < 100) {
      this.size = 'medium';
    } else {
      this.size = 'small';
    }
    next();
  });

  // static method to find animals by size
  AnimalSchema.statics.findSize = function(size, callback) {
    // this == Animal
    return this.find({size: size}, callback);
  };

  // instance method to find animals of the same color as the current animal
  AnimalSchema.methods.findSameColor = function(callback) {
    // this == document
    return this.model('Animal').find({color: this.color}, callback);
  };

  // create a model
  const Animal = mongoose.model('Animal', AnimalSchema);

  // create documents
  const elephant = new Animal({
    type: 'elephant',
    color: 'grey',
    mass: 6000,
    name: 'Lawrence' 
  });

  const animal = new Animal({}); // default goldfish

  const whale = new Animal({
    name: 'Wally',
    type: 'whale',
    mass: 190500
  });

  const animalData = [
    {
      type: 'mouse',
      color: 'grey',
      mass: 0.035,
      name: 'Marvin'
    },
    {
      type: 'nutria',
      color: 'brown',
      mass: 6.35,
      name: 'Gretchen'
    },
    {
      type: 'wolf',
      color: 'grey',
      mass: 45,
      name: 'Iris'
    },
    elephant,
    animal,
    whale
  ];

  // using async/await
  async function run () {
    try {
      // remove all documents
      await Animal.deleteMany();
      console.log('deleted successfully');

      // save the animals
      await Animal.create(animalData);
      console.log('saved the animals');

      // list all the medium animals
      console.log('Medium Animals:');
      const animals = await Animal.findSize('medium');
      listAnimals(animals);

      // list the animals with the same color as the elephant
      console.log('Similar colors:');
      await Animal.findOne({type: 'goldfish'}, async (err, animal) => {
        await animal.findSameColor((err, output) => {
          listAnimals(output);
        });
      });

      // close the database
      db.close();
      console.log('db connection closed');
    } catch (err) {
      console.error(err);
      db.close()
    }
  };
  run();
});