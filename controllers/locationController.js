const client = require('../config/sanityConfig')

// @desc Create Active Location
// @route POST /api/locations
const createLocation = async (req, res, next) => {
  function createSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0,96)
  }
  if(typeof req.body.placeName !== 'string' || !req.body.placeName.trim()) {
    return res.status(400).json({error: "Place Name is required and it must be string"})
  }
  const newBody = { 
    ...req.body, 
    slug: {_type: 'slug', current: createSlug(req.body.placeName) } 
  }
  try {
    const result = await client.create(newBody)
        res.status(201).json(result)
      } catch (error) {
        next(error)
      }
}

module.exports = { createLocation }