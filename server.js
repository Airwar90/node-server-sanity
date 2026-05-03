const express = require('express')
require('dotenv').config()
const cors = require('cors')

const { errorHandler } = require('./middleware/errorMiddleware')

const port = process.env.PORT || 5000
console.log(process.env.SANITY_PROJECT_ID)
const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//NEW ROUTES
app.use('/api/locations', require('./routes/locationRoutes'))
app.use('/api/services', require('./routes/serviceRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))