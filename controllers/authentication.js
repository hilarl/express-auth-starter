const User = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config')

// Generate JWT Token
function tokenForUser(user) {
  const timestamp = new Date().getTime()
  return jwt.encode({sub: user.id, iat: timestamp}, config.secret)
}

// Signin user
exports.signin = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) })
}

// Submit user information
exports.signup = function(req, res, next) {
  const email = req.body.email
  const password = req.body.password

  // Check if email and password fields are not null
  if(!email || !password) {
    return res.status(422).send({ error: "You must provide an email and password" })
  }

  // Check if email address exist
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err) }

    if (existingUser) {
      return res.status(422).send("Email in use")
    }

    // Create user account
    const user = new User({
      email: email,
      password: password
    })

    // Save user in the db
    user.save(function(err) {
      if (err) { return next(err) }
      
      res.json({token: tokenForUser(user)})
    })
  })

}
