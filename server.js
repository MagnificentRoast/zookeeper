const fs = require('fs');
const path = require('path');
const express = require('express');
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming json data
app.use(express.json());
// uses express to return static pages in 'public'
app.use(express.static('public'));

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    personalityTraitsArray.forEach(trait => {
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

// below function validates information for animal to send to animals.json
function validateAnimal(animal) {
  // remember, name, species, diet, personalityTraits
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || typeof animal.personalityTraits !== 'string') {
    return false;
  }
  return true;
}

function createNewAnimal(body, animalsArray) {
  console.log(body);
  // our function's main code will go here
  const animal = body;
  animalsArray.push(animal);
  fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  // returns finished code to post route for response
  return animal;
}

app.get('/api/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.post('/api/animals', (req, res) => {
  // set id based on what the next index of the array will be.
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back.
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});
//when you first load from the server, it loads index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})
// loads animals.html when you type this address in
app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'))
});
//loads zookeeper.html when you type this address in
app.get('/zookeeper', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'))
});
// for all other cases so no errors will occur for the client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
