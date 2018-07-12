const express = require('express');
const Snippet = require('../models/Snippet')
const jwt = require('jwt-simple');
const passport = require('passport');
const config = require('../configs/index');
const User = require("../models/User");

var router = express.Router();


router.get('/:username', (req, res, next) => {
  let username = req.params.username;

  User.findOne({username}).populate("_favorites")
    .then(user => {
      res.json(user);
    })
    .catch(err => next(err))
});


//You need to be authenticated
router.post('/snippets/:snippetId/favorites', passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  let snippetId = req.params.snippetId;
  let user = req.user.id

  User.findByIdAndUpdate(user, {$push: {_favorites: snippetId}}, {new: true})
    .then(newUser => {
      res.json(newUser);
    })
    .catch(err => next(err))
});


module.exports = router;
