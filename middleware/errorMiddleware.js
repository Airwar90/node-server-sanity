// Central error handler: every controller should pass unexpected errors here via next(err).
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err)

    // Only trust a status the error explicitly marks as safe to expose
    // Errors from the Sanity client also carry a statusCode, but that's Sanity's response to the server,
    // so those are treated as 500s for the front end.
    const status = err.expose && err.status >= 400 && err.status < 500 ? err.status : 500

    console.error(`${req.method} ${req.originalUrl} -> ${status}`, err)

    res.status(status).json({
        // 'message' is the field the frontend reads (see swm-wld-app addService.jsx)
        message: status === 500 ? 'Internal server error' : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    })
}

module.exports = {
    errorHandler,
}
