const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// Create Task
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body, // Spread operator copies over attributes from req.body
    user: req.user._id // get this from authentication
  })
  
  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Tasks index with optional search parameters
// GET /tasks?completed={true/false}?&limit={int}&skip={int}&sortBy=createdAt:{asc/desc}
// When pass in 2 values to the params we tend to separate by special character, e.g. '_', ':'
router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}

  if (req.query.completed) {
    match.completed = req.query.completed === 'true' // Converting from string to boolean
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit), // If limit not provided or not a number its ignored
        skip: parseInt(req.query.skip), // Works same way as limit
        sort
      }
    }).execPopulate()

    res.send(req.user.tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

// Show task
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOne({ _id, user: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({error: 'Not a valid update'})
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    updates.forEach(update => task[update] = req.body[update])
    await task.save()

    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router