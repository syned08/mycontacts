const express = require('express');
const { MongoClient } = require('mongodb');
const morgan = require('morgan');

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const homeRoute = require('./routes/home');

const PORT = 3000;
const app = express();

app.use(express.json());
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/views'));
app.use(morgan('tiny'));

app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/home', homeRoute);

app.use('*', (req, res) => {
  res.redirect('/login');
});

MongoClient.connect(
  'mongodb://localhost:27017/mycontacts',
  { useUnifiedTopology: true },
  { promiseLibrary: Promise },
  { useNewUrlParser: true },
)
  .catch((err) => console.error(err.stack))
  .then((client) => {
    app.locals.db = client.db('mycontacts');
    app.listen(PORT, () => {
      console.log(`server has been started on port ${PORT}`);
    });
  });
