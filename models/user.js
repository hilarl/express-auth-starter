const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const Schema = mongoose.Schema

// Create schema
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String
})

// On save, encrypt password
userSchema.pre('save', function(next) {
  const user = this
  // Generate salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err) }
    // Hash password
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err) }
      // Return hashed password
      user.password = hash
      next()
    })
  })
})

// Compare password hashes using bcrypt
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err) }
    callback(null, isMatch)
  })
}

// Create model
const ModelClass = mongoose.model('user', userSchema)

module.exports = ModelClass
