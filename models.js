//mongoDB setup
const mongoose = require('mongoose');

//Sema i model za tabelu user
const userSchema = new mongoose.Schema({
  user: String,
  password: String,
  role: { type: String, enum: ['creator', 'editor', 'admin'] },
});
exports.User = mongoose.model('User', userSchema);

//sema i model za tabelu card
const cardSchema = new mongoose.Schema({
  name: String,
  weight: Number,
  image_path: String,
  description: String,
  status: {
    type: String,
    enum: ['submitted', 'approved', 'done'],
    default: 'submitted',
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
exports.Card = mongoose.model('Card', cardSchema);

//sema i model za tabelu discussion
const discussionSchema = new mongoose.Schema({
  name: String,
  content: String,
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
exports.Discussion = mongoose.model('Discussion', discussionSchema);

//sema i model za tabelu comment
const commentSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  discussion: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
});
exports.Comment = mongoose.model('Comment', commentSchema);
