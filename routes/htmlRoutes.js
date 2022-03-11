const path = require('path');
const router = require('express').Router();
//when you first load from the server, it loads index.html
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
  })
  // loads animals.html when you type this address in
  router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/animals.html'))
  });
  //loads zookeeper.html when you type this address in
  router.get('/zookeeper', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/zookeepers.html'))
  });
  // for all other cases so no errors will occur for the client
  router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
  })

  module.exports = router;