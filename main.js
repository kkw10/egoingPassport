const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const indexRouter= require('./routes/index');
const topicRouter = require('./routes/topic');
const authRouter = require('./routes/auth');
const helmet = require('helmet');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const authData = {
  email: 'test123@gmail.com',
  password: '123',
  nickname: 'tester'
}

// middle
app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(session({
  secret: 'test123',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log('serializeUser', user);
  done(null, user.email)
})

passport.deserializeUser((id, done) => {
  console.log('deserializeUser', id)
  done(null, authData)
})

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'pwd'
}, (username, password, done) => {
    console.log('LocalStrategy', username, password)
    if(username === authData.email) {
      if(password === authData.password) {
        return done(null, authData)
      } else {
        return done(null, false, { message: 'Incorrect password.' })
      }
    } else {
      return done(null, false, { message: 'Incorrect email.' })
    }
  }
))

app.post('/auth/login_process', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
}))

// coustom middle
app.get('*', (req, res, next) => {
  fs.readdir('./data', function(error, filelist) {
    req.list = filelist;
    next();
  })
})

// routing
app.use('/', indexRouter)
app.use('/topic', topicRouter)
app.use('/auth', authRouter)

// error
app.use((req, res, next) => {
  res.status(404).send("404 not found...")
})
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Somthing broke...")
})

app.listen(3000, () => {
  console.log('Server is running...')
})

