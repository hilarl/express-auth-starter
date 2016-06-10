const express = require('express')
const http = require('http')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const router = require('./router')
const mongoose = require('mongoose')

// Connect to DB
mongoose.connect('mongodb://localhost:auth/auth')

// Create an instance of Express
const app = express()

app.use(morgan('combined'))
app.use(bodyParser.json({type: '*/*'}))
router(app)

// Create http server
const port = process.env.PORT || 3090
const server = http.createServer(app)
server.listen(port)
console.log("Server started on ", port)
