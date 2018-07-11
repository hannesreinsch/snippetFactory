var express = require('express');
const Snippet = require('../models/Snippet')


var router = express.Router();


router.get('/:id', (req, res, next) => {
  User.find()
    .then(user => {
      res.json(user);
    })
    .catch(err => next(err))
});

// You need to be authenticated
router.post('/snippets/:snippetId/favorites', passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
// TODO

});


module.exports = router;
