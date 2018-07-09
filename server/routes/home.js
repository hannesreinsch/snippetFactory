var express = require('express');
const Snippet = require('../models/Snippet')

var router = express.Router();


router.get('/', (req, res, next) => {
  Snippet.find()
    .then(snippets => {
      res.json(snippets);
    })
    .catch(err => next(err))
});


// Route to add a snippet
router.post('/', (req, res, next) => {
  let {code, heading} = req.body;
  Snippet.create({code, heading})
    .then(snippet => {
      res.json({
        success: true,
        snippet
      });
    })
    .catch(err => next(err))
});

module.exports = router;
