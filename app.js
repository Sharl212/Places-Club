const createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  mongoose = require('mongoose'),
  cons = require('consolidate'),
  moment = require('moment'),
  MongoClient = require('mongodb').MongoClient,
  { SchemaModel } = require('./public/javascripts/User_Schema'),
  { GoingStatusSchema } = require('./public/javascripts/Going_Schema'),
  { authenticate } = require('./public/javascripts/authenticate'),

  app = express();


// view engine setup

var router = express.Router();

mongoose.connect("mongodb://localhost:27017/nightlife", (err, db) => {
  if (err) {
    return console.log(err);
  }

  console.log("Connected to MongoDB database..");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', cons.swig)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/register', indexUsers);
app.get('/register', (req, res) => {
  console.log('register page')
  res.render('./register');
});

app.get('/login', (req, res) => {
  console.log('login page')
  res.render('./login');
});

app.get('/people', (req, res) => {
  console.log('people page')
  res.render('./people');
});

app.get('/', (req, res) => {
  res.render('./layout');
});

app.post("/register", (req, res) => { // register with username, password
  console.log(req.body);
  const newAccount = new SchemaModel({
    username: req.body.username,
    password: req.body.password
  });

  newAccount.save().then((data) => {
    return newAccount.generateAuthToken();
  }).then((token) => {
    console.log(token);
    res.cookie('authorizationToken', token).status(200).send();
  }).catch((err) => res.status(400).send(err));
});


app.post("/login", (req, res) => { // login , generate authentication token
  SchemaModel.findByCredentials(req.body.username, req.body.password).then(function (user) {
    return user.generateAuthToken().then(function (token) {
      res.cookie("authorizationToken", token).send(user);
    });
  }).catch((err) => {
    res.status(404).send();
  });
});

app.post("/goingto", authenticate, (req, res) => {
  let _id = req.body._id;
  let place = req.body.place;

  console.log(moment().format());
  console.log(_id, place);

  GoingStatusSchema.findById(_id).then((results) => {
    if (results == null) { // if the place does not exist, create it.
      let goingTo = new GoingStatusSchema({
        _creator: req.user._id,
        place: place,
        _id: _id,
        createdAt: moment().format()
      });

      goingTo.save().then(() => { //save the place details
        res.status(200).send();
      }).catch((e) => {
        res.status(400).send();
      });

      GoingStatusSchema.findByIdAndUpdate(_id, { $set: { "numberGoing": numGoing + 1 } }, { new: true }, (err, newlist) => {
        console.log(newlist);
      }).catch((e) => {
        res.status(400).send();
      });

    } else { // if the place DOES exist, and the user DID NOT vote before then accept their vote
      console.log(results);
      let numGoing = results.numberGoing;
      GoingStatusSchema.findByIdAndUpdate(_id, { $set: { "numberGoing": numGoing + 1 } }, { new: true }, (err, newlist) => {
        console.log(newlist);
        res.status(200).send(newlist);
      }).catch((e) => {
        res.status(400).send();
      });
    }
  });
});


app.get("/peoplegoing", (req, res) => {
  GoingStatusSchema
    .find({})
    .populate('_creator') // <--
    .exec(function (err, result) {
      if (err) res.status(400).send();
      // console.log('The creator is %s', result._creator.username);
      res.status(200).send(result);
      // prints "The creator is Aaron"
    });
});

app.listen(process.env.PORT || 3000, () => console.log('Server is running on port 3000..'));
module.exports = app;
