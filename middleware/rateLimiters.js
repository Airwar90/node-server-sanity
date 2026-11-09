const rateLimit = require('express-rate-limit')

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

const baseOptions = {
    windowMs: WINDOW_MS,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, try again later' },
}

// Writes: each addService submission uploads 1 image and then sends 1 form
// i.e. 2 requests per form submission
const writeLimiter = rateLimit({
    ...baseOptions,
    limit: Number(process.env.WRITE_RATE_LIMIT) || 20,
})

// Reads: normal browsing fetches the service list, search results (one per
// debounced keystroke), service pages, bookmarks and info pages, so this
// needs to be much higher than the write limit.
const readLimiter = rateLimit({
    ...baseOptions,
    limit: Number(process.env.READ_RATE_LIMIT) || 300,
})

module.exports = { writeLimiter, readLimiter }
