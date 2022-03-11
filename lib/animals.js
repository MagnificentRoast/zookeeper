const fs = require('fs');
const path = require('path');

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
      path.join(__dirname, '../data/animals.json'),
      JSON.stringify({ animals: animalsArray }, null, 2)
    );
    // returns finished code to post route for response
    return animal;
  }

  module.exports = {
      filterByQuery,
      findById,
      createNewAnimal,
      validateAnimal
  };