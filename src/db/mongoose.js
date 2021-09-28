const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true, // Means mongoose creates indexes (indices?) for us
    useFindAndModify: false // Prevents a repeat warning showing up constantly
})
