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


router.delete('/:username', (req, res, next) => {
  let username = req.params.username;

  User.findOneAndRemove({username})
    .then(user => {
      Snippet.deleteMany({_owner: user._id})
        .then(() => {
          res.json(user);
        })
    })
    .catch(err => next(err))

});


  router.put('/:username', (req, res, next) => {
    let username = req.params.username;
    const password = req.body.password;

    User.findOneAndUpdate({username}, {email: req.body.email })
      .then(userDoc => {
        return userDoc.setPassword(password)
      })
      .then(userDoc => userDoc.save())
      .then(userDoc => {
        res.json({ success: true, user: userDoc });
      })
      .catch(err => next(err))
  });



router.post('/snippets/:snippetId/favorites', passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  let snippetId = req.params.snippetId;
  let user = req.user.id
  
  User.findByIdAndUpdate(user, {$push: {_favorites: snippetId}}, {new: true})
    .then(newUser => {
      res.json(newUser);
    })
    .catch(err => next(err))

    Snippet.findById(snippetId)
    .then(snippet => {
      snippet.numOfFavorite = snippet.numOfFavorite +1;
      snippet.save()
  
      console.log("INSIDE FAVORITE ADD")})
});




router.delete('/snippets/:snippetId/favorites', passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  let snippetId = req.params.snippetId;
  let user = req.user.id
  

  User.findByIdAndUpdate(user, {$pull: {_favorites: snippetId}}, {new: true})
    .then(newUser => {
      res.json(newUser);
    })
    .catch(err => next(err))
    

  Snippet.findById(snippetId)
  .then(snippet => {
    snippet.numOfFavorite = snippet.numOfFavorite -1;
    snippet.save()

    console.log("INSIDE FAVORITE DELETE")})

});



module.exports = router;
