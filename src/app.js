require('dotenv').config()
require('./database/mongoose')
const express = require('express')
const app = express()
const port = process.env.PORT
const userRouter = require('./routes/user')







app.use(express.json())
app.use(userRouter)





app.listen(port, () => { console.log( `Server Is Up ON ${port}` )})