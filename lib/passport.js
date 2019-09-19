const authData = {
    email: 'test123@gmail.com',
    password: '123',
    nickname: 'tester'
  }

module.exports = function(app) {
    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;
    
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
            return done(null, authData, { message: 'login success.' })
          } else {
            return done(null, false, { message: 'Incorrect password.' })
          }
        } else {
          return done(null, false, { message: 'Incorrect email.' })
        }
      }
    ))   

    return passport
}