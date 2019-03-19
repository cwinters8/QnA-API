const express = require('express');
const router = express.Router();
const Question = require('./models').Question;

'use strict';

// GET /questions
// Route for questions collection
router.get('/', (req, res, next) => {
  // return all the questions, sorted in descending order
  Question.find({}, null, {sort: {createdAt: -1}}, (err, questions) => { //null is for projection placeholder
    if (err) return next(err);
    res.json(questions);
  });
});

// POST /questions
// Route for creating questions
router.post('/', (req, res) => {
  res.json({
    response: "You sent me a POST request",
    body: req.body
  });
})

// GET /questions/:qID
// Route for specific questions
router.get('/:qID', (req,res) => {
  res.json({
    response: `You sent me a GET request for ID ${req.params.qID}`
  });
});

// POST /questions/:qID/answers
// Route for creating answers
router.post('/:qID/answers', (req, res) => {
  res.json({
    response: 'You sent me a POST request to /answers',
    questionId: req.params.qID,
    body: req.body
  });
});

// PUT /questions/:qID/answers/:aID
// Route for updating an answer
router.put('/:qID/answers/:aID', (req, res) => {
  res.json({
    response: 'You sent me a PUT request to /answers',
    questionId: req.params.qID,
    answerId: req.params.aID,
    body: req.body
  });
});

// DELETE /questions/:qID/answers/:aID
// Route for deleting an answer
router.delete('/:qID/answers/:aID', (req, res) => {
  res.json({
    response: 'You sent me a DELETE request to /answers',
    questionId: req.params.qID,
    answerId: req.params.aID
  });
});

// POST /questions/:qID/answers/:aID/vote-up
// POST /questions/:qID/answers/:aID/vote-down
// Route for voting on an answer
router.post('/:qID/answers/:aID/vote-:dir', (req, res, next) => {
  if (req.params.dir.search(/^(up|down)$/) === -1) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  } else {
    next();
  }
},(req, res) => {
  res.json({
    response: 'You sent me a POST request to /vote-' + req.params.dir,
    questionId: req.params.qID,
    answerId: req.params.aID,
    vote: req.params.dir
  });
});

module.exports = router;