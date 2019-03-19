const mongoose = require('mongoose');

'use strict';

const Schema = mongoose.Schema;

const sortAnswers = (a, b) => {
  if (a.votes === b.votes) {
    return b.updatedAt - a.updatedAt;
  }
  return b.votes - a.votes;
}

const AnswerSchema = new Schema({
  text: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  votes: {type: Number, default: 0}
})

// instance method to update an answer
AnswerSchema.method('update', function(updates, callback) {
  Object.assign(this, updates, {updatedAt: new Date()});
  this.parent().save(callback);
});

// increase or decrease votes
AnswerSchema.method('vote', function(vote, callback) {
  if (vote === 'up') {
    this.votes += 1;
  } else {
    this.votes -= 1;
  }
  this.parent().save(callback);
});

const QuestionSchema = new Schema({
  text: String,
  createdAt: {type: Date, default: Date.now},
  answers = [AnswerSchema]
});

// pre-save hook to order answers
QuestionSchema.pre('save', function (next) {
  this.answers.sort(sortAnswers);
  next();
})

const Question = mongoose.model("Question", QuestionSchema);

module.exports.Question = Question;