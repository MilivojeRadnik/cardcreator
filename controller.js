const { User, Card, Discussion, Comment } = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginGet = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.login = async (req, res) => {
  var login = await User.findOne({ user: req.query.user });
  var errors = [];
  if (!login) {
    errors.push('Pogresan user!');
    return res.render('login', { title: 'Login', errors });
  } else {
    bcrypt.compare(req.query.password, login.password, (err, result) => {
      if (err) return res.status(401).end();

      if (!result) {
        errors.push('Pogresan password!');
        return res.render('login', { title: 'Login', errors });
      } else {
        let user = { _id: login._id, user: login.user, role: login.role };

        let token = jwt.sign(
          user,
          process.env.ACCESS_TOKEN_SECRET || 'topsecret',
          {
            expiresIn: '864000s',
          }
        );

        return res
          .cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
          })
          .status(200)
          .end();
      }
    });
  }
};

exports.updateLogGet = (req, res) => {
  res.render('updatelog', { title: 'Sta je novo?' });
};

//logout
exports.logout = (req, res) => {
  return res.clearCookie('jwt').redirect('/');
};

//form
exports.formGet = (req, res) => {
  res.render('form', { title: 'Napravi karticu' });
};

exports.formPost = async (req, res) => {
  const { name, weight, description } = req.body;

  var image_path = req.file ? '/' + req.file.path.replace(/\\/g, '/') : '';
  var errors = [];
  var messages = [];
  const newCard = new Card({
    name,
    weight,
    image_path,
    description,
    creator: req.user._id,
  });
  const card = await Card.findOne({ name: newCard.name });
  if (card) {
    errors.push('Postoji karta sa istim imenom');
    res.render('form', { title: 'Napravi karticu', errors });
  } else {
    messages.push('Karta uspjesno kreirana!');
    await newCard.save();
    res.render('form', { title: 'Napravi karticu', messages });
  }
};

//liste

exports.listGet = (req, res) => {
  Card.find({ creator: req.user._id, status: 'submitted' }, (err, docs) => {
    if (err) throw err;
    var cards = [];
    docs.forEach((doc) => {
      var card = {
        id: doc._id,
        name: doc.name,
        weight: doc.weight,
        image_path: doc.image_path,
        status: doc.status,
      };
      cards.push(card);
    });
    if (cards[0] == undefined) cards = undefined;
    var errors = [];
    var messages = [];
    if (req.query.msgId == 'a1b69kyk0kK5R5AR1MLa3w') {
      errors.push('To je bilo ilegalno!');
      messages = undefined;
    } else if (req.query.msgId == 'rWhK3tVQ6Uqcek1vfJfHXQ') {
      messages.push('Karta obrisana!');
      errors = undefined;
    } else if (req.query.msgId == 'hjHUjnXiUkO0diYPzKKQSQ') {
      errors.push('Karta ne postoji!');
      messages = undefined;
    } else {
      messages = undefined;
      errors = undefined;
    }
    res.render('list', { title: 'Lista', cards, errors, messages });
  });
};

exports.listSelectGet = (req, res) => {
  res.render('list-select', { title: 'Lista', user: req.user });
};

exports.deleteCard = (req, res) => {
  Card.findById(req.query.id, (err, data) => {
    if (err) throw err;
    if (!data.creator.equals(req.user._id)) {
      res.redirect('/list?msgId=a1b69kyk0kK5R5AR1MLa3w');
    } else {
      Card.findByIdAndDelete(data._id, (err) => {
        if (err) throw err;
        res.redirect('/list?msgId=rWhK3tVQ6Uqcek1vfJfHXQ');
      });
    }
  });
};

exports.cardDetailsGet = async (req, res) => {
  Card.findById(req.query.id, (err, data) => {
    if (err) {
      res.redirect('/list?msgId=hjHUjnXiUkO0diYPzKKQSQ');
    } else res.render('card_details', { title: data.name, card: data });
  });
};

exports.cardUpdate = (req, res) => {
  var { name, weight, image_path, description } = req.body;
  image_path = req.file ? '/' + req.file.path.replace(/\\/g, '/') : image_path;

  console.log({ name, weight, image_path, description });

  Card.findOneAndUpdate(
    { _id: req.query.id },
    {
      name,
      weight,
      image_path,
      description,
    },
    { new: true },
    (err, data) => {
      if (err) throw err;
      var messages = ['Karta uspjesno promijenjena!'];
      res.render('card_details', { title: data.name, card: data, messages });
    }
  );
};

exports.listPanelGet = (req, res) => {
  Card.find({ status: { $ne: 'done' } })
    .populate('creator')
    .sort('status -creator')
    .exec((err, docs) => {
      if (err) throw err;
      var cards = [];
      docs.forEach((doc) => {
        var card = {
          id: doc._id,
          creator: doc.creator.user,
          name: doc.name,
          weight: doc.weight,
          image_path: doc.image_path,
          status: doc.status,
        };
        cards.push(card);
      });

      if (cards[0] == undefined) cards = undefined;
      var errors = [];
      var messages = [];
      if (req.query.msgId == 'a1b69kyk0kK5R5AR1MLa3w') {
        errors.push('To je bilo ilegalno!');
        messages = undefined;
        // } else if (req.query.msgId == 'rWhK3tVQ6Uqcek1vfJfHXQ') {
        //   messages.push('Karta obrisana!');
        //   errors = undefined;
      } else if (req.query.msgId == 'hjHUjnXiUkO0diYPzKKQSQ') {
        errors.push('Karta ne postoji!');
        messages = undefined;
      } else {
        messages = undefined;
        errors = undefined;
      }
      res.render('list_panel', {
        title: 'Lista',
        cards,
        user: req.user,
      });
    });
};

exports.cardPanelGet = (req, res) => {
  Card.findById(req.query.id, (err, data) => {
    if (err) {
      res.redirect('/list-panel?msgId=hjHUjnXiUkO0diYPzKKQSQ');
    } else
      res.render('edit', {
        title: data.name,
        card: data,
        user: req.user,
      });
  });
};

exports.cardPanelPost = (req, res) => {
  if (req.user.role == 'admin') {
    var status = 'approved';
    var messages = ['Karta odobrena!'];
  } else if (req.user.role == 'editor') {
    var status = 'done';
    var messages = ['Karta oznacena kao gotova!'];
  }
  Card.findOneAndUpdate(
    { _id: req.query.id },
    { status },
    { new: true },
    (err, data) => {
      if (err) throw err;
      res.render('edit', {
        title: data.name,
        card: data,
        messages,
        user: req.user,
      });
    }
  );
};

exports.doneGet = (req, res) => {
  Card.find({ status: 'done' })
    .populate('creator')
    .exec((err, cards) => {
      if (err) throw err;
      if (!cards[0]) cards = undefined;
      res.render('list_done', { title: 'lista', cards });
    });
};

exports.viewCardGet = (req, res) => {
  Card.findById(req.query.id, (err, card) => {
    if (err) throw err;
    res.render('viewcard', { title: card.name, card });
  });
};

exports.discussionsGet = (req, res) => {
  Discussion.find({ status: 'open' })
    .populate('creator')
    .exec((err, discussions) => {
      if (err) throw err;
      res.render('discussions-list', { title: 'Diskusije', discussions });
    });
};

exports.discusionCreateGet = (req, res) => {
  res.render('discussion-create', { tytle: 'Kreiranje diskusije' });
};

exports.discusionCreatePost = (req, res) => {
  var { name, content } = req.body;
  var discussion = new Discussion({
    name,
    content,
    creator: req.user._id,
  });
  discussion.save((err) => {
    if (err) throw err;
    res.redirect('/discussions');
  });
};

exports.discussionGet = async (req, res) => {
  var discussion = await Discussion.findById(req.query.id);
  var comments = await Comment.find({
    discussion: req.query.id,
    replyTo: null,
  }).populate('creator');
  var replies = await Comment.find({
    discussion: req.query.id,
    replyTo: { $ne: null },
  }).populate('creator');

  for (i = 0; i < comments.length; i++) {
    var newReplies = new Array();
    for (q = 0; q < replies.length; q++) {
      if (replies[q].replyTo == comments[i].id) {
        newReplies.push(replies[q]);
      }
    }
    comments[i].replies = newReplies;
  }

  res.render('discussion', { title: discussion.name, discussion, comments });
};

exports.discussionComment = (req, res) => {
  var comment = new Comment({
    creator: req.user._id,
    content: req.body.content,
    discussion: req.body.discussion,
    replyTo: req.body.replyTo || null,
  });
  comment.save((err) => {
    if (err) throw err;
    res.redirect('/discussion?id=' + req.query.id);
  });
};

//ispitivaci
exports.logedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/');
  }
};

exports.ifCreator = (req, res, next) => {
  if (req.user.role === 'creator') {
    res.redirect('/list');
  } else {
    next();
  }
};
