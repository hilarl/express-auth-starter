const passport = require('passport')
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')

// Create local strategy to verify user signin
const localOptions = { usernameField: 'email' }

// Verify user signin
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err) }
    if (!user) { return done(null, false) }

    // Compare passwords to see if there is a match
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err) }
      if (!isMatch) { return done(null, false) }
      return done(null, user)
      console.log(user)
    })
  })
})

// Setup options for JWT Strategy
const opts = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

// Create JWT Strategy
const jwtLogin = new JwtStrategy(opts, function(payload, done) {
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false) }
    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})

// Assign strategies to passport
passport.use(jwtLogin)
passport.use(localLogin)
