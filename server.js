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

//NEW ROUTES
app.use('/api/services', require('./routes/serviceRoutes'))
app.use('/api/uploadImage', require('./routes/imageRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))