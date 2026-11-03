const { getAuth } = require('@clerk/express')
const client = require('../config/sanityConfig')

// Must run after clerkMiddleware() (registered in server.js).
const requireUser = (req, res, next) => {
    const { userId } = getAuth(req)
    if (!userId) {
        return res.status(401).json({ message: 'You must be signed in to do this' })
    }
    req.userId = userId
    next()
}

// Requires the signed-in user to be the owner of the service in :slug.
const requireServiceOwner = async (req, res, next) => {
    try {
        const service = await client.fetch(
            `*[_type == "service" && slug.current == $slug][0]{ _id, ownerId }`,
            { slug: req.params.slug }
        )
        if (!service) {
            return res.status(404).json({ message: 'Service not found' })
        }
        if (!service.ownerId || service.ownerId !== req.userId) {
            return res.status(403).json({ message: 'You can only change services you created' })
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = { requireUser, requireServiceOwner }
