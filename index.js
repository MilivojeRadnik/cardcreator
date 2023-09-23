const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

//multer - rad sa slikama
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    var nameSplit = file.originalname.split('.');
    var extension = nameSplit[nameSplit.length - 1];
    cb(null, file.fieldname + uniqueSuffix + '.' + extension);
  },
});
const upload = multer({
  storage: storage,
});

//mongoDB setup
const mongoose = require('mongoose');
const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://korisnik:qwerty123@cluster0.cuabd.mongodb.net/akatron?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

const router = require('./router');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.set('views', './views');
app.set('view engine', 'pug');

app.use('/', router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Listening on port:', port);
});

const { User } = require('./models');
const quickQuery = async () => {
  User.find((err, result) => {
    if (err) throw err;

    console.log('alive');
  });
};

const intervalInMilliseconds = 20 * 60 * 1000;

const scheduler = setInterval(() => {
  quickQuery();
}, intervalInMilliseconds);
