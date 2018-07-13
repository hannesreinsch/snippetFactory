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


  // let data = {
  //   heading: heading,
  //   code: code,
  //   _owner: _owner,
  // }

  // let newSnippet = new Snippet(data);

  // newSnippet.save()
  //   .then(snippet => {
  //     res.json({
  //       success: true,
  //       snippet
  //     });
  //   })
  //   .catch(err => next(err))



});


// Route to edit a post
// router.put('/', passport.authenticate("jwt", config.jwtSession), (req, res, next) => {

//   let {code, heading} = req.body;

//   Snippet.update({code, heading})
//     .then(snippet => {
//       if(snippet._owner === req.user.id)
//       res.json({
//         success: true,
//         snippet
//       })
//     })
//     .catch(err => next(err))
  
// });




module.exports = router;