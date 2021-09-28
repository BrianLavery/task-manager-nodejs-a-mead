const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

// We need schema for a bunch of custom methods, e.g. to use bcrypt prior to save, to define custom methodds
const userSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure we have unique values - need to drop database, then restart app for this to work
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Enter a valid email')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Your password cannot contain the phrase "password"')
      }
    }
  },
  age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('Age must be a positive number')
        }
      }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: { // This is how we store images
    type: Buffer
  }
}, {
  timestamps: true // By default is set to false
})

// Virtual property (not stored in DB) - so we can say that a user has many tasks // define field name then configure
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id', // This is connection to the model we are in (user id)
  foreignField: 'user' // This is what it is stored in in the other collection (i.e. in tasks collection)
})

// Ensure we limit user info shared to client; presumably override inherited method
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar
  
  return userObject
}

// Instance method for user
userSchema.methods.generateAuthToken = async function () {
  const user = this // Line not required but makes easier to read
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
  
  user.tokens = user.tokens.concat({ token })
  await user.save()
  
  return token
}

// We are defining a custom method for the model - on the User class/ model
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Unable to login') // Don't be too specific on the error for login
  }

  // Check if passwords match
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login') // Don't be too specific on the error for login
  }

  return user
}

// Callback type function - this is pre-saving we hash the password
userSchema.pre('save', async function (next) {
  const user = this // optional - makes easier to read

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next() // Let's Mongoose know when we are done
})

// Middleware to delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
  const user = this
  await Task.deleteMany({ user: user._id }) // This will delete all tasks belonging to this user
  next() // Let's Mongoose know when we are done
})

const User = mongoose.model('User', userSchema)

module.exports = User
