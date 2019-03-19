const express = require('express');
const router = express.Router();
const Question = require('./models').Question;

'use strict';

// preload question docs - run when a question ID param is present
router.param('qID', (req, res, next, id) => {
  Question.findById(id, (err, doc) => {
    if (err) return next(err);
    if (!doc) {
      err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }
    req.question = doc;
    next();
  });
});

router.param('aID', (req, res, next, id) => {
  req.answer = req.question.answers.id(id);
  if (!req.answer) {
    err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }
  next();
});

// GET /questions
// Route for questions collection
router.get('/', (req, res, next) => {
  // return all the questions, sorted in descending order
  Question.find({})
    .sort({createdAt: -1})
    .exec((err, questions) => {
      if (err) return next(err);
      res.json(questions);
    });
});

// POST /questions
// Route for creating questions
router.post('/', (req, res, next) => {
  const question = new Question(req.body);
  question.save((err, question) => {
    if (err) return next(err);
    res.status(201);
    res.json(question);
  });
});

// GET /questions/:qID
// Route for specific questions
router.get('/:qID', (req, res, next) => {
  res.json(req.question);
});

// POST /questions/:qID/answers
// Route for creating answers
router.post('/:qID/answers', (req, res, next) => {
  req.question.answers.push(req.body);
  req.question.save((err, question) => {
    if (err) return next(err);
    res.status(201);
    res.json(question);
  });
});

// PUT /questions/:qID/answers/:aID
// Route for updating an answer
router.put('/:qID/answers/:aID', (req, res) => {
  req.answer.update(req.body, (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
});

// DELETE /questions/:qID/answers/:aID
// Route for deleting an answer
router.delete('/:qID/answers/:aID', (req, res) => {
  req.answer.remove(err => {
    req.question.save((err, question) => {
      if (err) return next(err);
      res.json(question);
    });
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