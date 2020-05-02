require('dotenv').config()
require('./database/mongoose')
const express = require('express')
const app = express()
const notifier = require('node-notifier')
const path = require("path")
const port = process.env.PORT
const userRouter = require('./routes/user')
const movieRouter = require('./routes/movie')
const tvShowRouter = require('./routes/tvShow')



app.use(express.json())
app.use(userRouter)
app.use(movieRouter)
app.use(tvShowRouter)

 

// notifier.notify({
//     title: "First Notification",
//     message: "Hello from out notification center",
//     icon:(__dirname, 'philly.jpg'),
//     sound: 'Frog',
//     wait: true,
// })
 

// notifier.on('click', function(notifierObject, options, event) {
//     console.log(notifierObject)
//   });


app.listen(port, () => { console.log( `Server Is Up ON ${port}` )})