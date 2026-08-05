const express = require('express')
require('dotenv').config()
const cors = require('cors')

const { errorHandler } = require('./middleware/errorMiddleware')

const port = process.env.PORT || 5000

const app = express()

app.use(cors({
    origin: 
    [
        process.env.CLIENT_URL,
        process.env.LOCAL_CLIENT_URL
    ]
}))
app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({ limit: '10mb', extended: false }))

app.set('trust proxy', 1)

const rateLimit = require('express-rate-limit')

const writeLimiter = rateLimit({
    windowMs: 15*60*1000, //15 minutes
    limit: 20, //number of requests per IP per time window, this should be 10 as each addService request uploads 1 image and then sends 1 form
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: 'Too many requests, try again later'},
})

//temporary debug line to check if trust proxy config is correct
app.get('/api/debug-ip', (req, res) => {
  res.json({
    resolvedIp: req.ip,
    ipChain: req.ips,
    rawXForwardedFor: req.headers['x-forwarded-for'] || null,
    socketPeer: req.socket.remoteAddress,
  })
})

app.use('/api/services', writeLimiter, require('./routes/serviceRoutes'))
app.use('/api/uploadImage', writeLimiter, require('./routes/imageRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))