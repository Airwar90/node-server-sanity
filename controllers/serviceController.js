const client = require('../config/sanityConfig')

// @desc Create Service
// @route POST /api/services
const createService = async (req, res, next) => {
  function createSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0,96)
  }
  if(typeof req.body.name !== 'string' || !req.body.name.trim()) {
    return res.status(400).json({error: "Name is required and it must be string"})
  }
  console.log("createService hit", JSON.stringify(req.body, null, 2))
  const newBody = { 
    ...req.body, 
    slug: {_type: 'slug', current: createSlug(req.body.name) }, 
    isPublished: false 
  }  
  try {
    const result = await client.create(newBody)
    res.status(201).json(result)
  } catch (error) {
    console.log("Sanity error", error)
    next(error)
  }
}

module.exports = { createService }