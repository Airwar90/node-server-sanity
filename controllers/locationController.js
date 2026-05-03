const client = require('../config/sanityConfig')

// @desc Create Active Location
// @route POST /api/locations
const createLocation = async (req, res, next) => {
  try {
    const result = await client.create(req.body)
        res.status(201).json(result)
      } catch (error) {
        next(error)
      }
}

module.exports = { createLocation }