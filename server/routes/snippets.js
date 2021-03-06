var express = require('express');
// const jwt = require('jwt-simple');
const passport = require('passport');
const config = require('../configs/index');
const Snippet = require('../models/Snippet');
var router = express.Router();



router.get('/', (req, res, next) => {

  Snippet.find().populate("_owner")
    .then(snippets => {
      res.json(snippets);
    })
    .catch(err => next(err))
});


router.get('/recent', (req, res, next) => {

  Snippet.find().populate("_owner").limit(10).sort({'createdAt': -1})
    .then(snippets => {
      res.json(snippets);
    })
    .catch(err => next(err))

});

router.get('/most-popular', (req, res, next) => {

  Snippet.find().populate("_owner").limit(10).sort({numOfFavorite: -1})
  .then(snippets => {
    res.json(snippets);
  })
  .catch(err => next(err))

});



// Route to add a snippet
router.post('/', passport.authenticate("jwt", config.jwtSession), (req, res, next) => {

  let {code, heading} = req.body;
  let _owner = req.user.id;

  Snippet.create({code, heading, _owner})
    .then(snippet => {
      res.json({
        success: true,
        snippet
      });
    })
    .catch(err => next(err))

});


  router.delete('/delete/:id', passport.authenticate("jwt", config.jwtSession), (req, res, next) => {

    let snippetId = req.params.id;
  
    Snippet.findByIdAndRemove(snippetId)
     .then(snippet => {     
       res.json({
         success: true,
         snippet
        });
     })
     .catch(err => next(err))

  });



module.exports = router;