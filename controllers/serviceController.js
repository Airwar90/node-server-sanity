const client = require('../config/sanityConfig')

// @desc Create Service
// @route POST /api/services
const createService = async (req, res, next) => {
  console.log("createService hit", JSON.stringify(req.body, null, 2))
  try {
    const result = await client.create(req.body)
    res.status(201).json(result)
  } catch (error) {
    console.log("Sanity error", error)
    next(error)
  }
}

module.exports = { createService }