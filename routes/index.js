const router = require('express').Router();
const animalRoutes = require('./apiRoutes/animalRoutes');
const htmlRoutes = require('./htmlRoutes')

router.use('/api', animalRoutes);
router.user('/', htmlRoutes);

module.exports = router;