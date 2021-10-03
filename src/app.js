const express = require('express')
require('./db/mongoose') //ensures file runs and mongoose connects to database
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

// This one line automatically parses incoming JSON to an object (req.body)
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app
