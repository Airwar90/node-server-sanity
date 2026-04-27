const client = require('../config/sanityConfig')

// @desc Create Service
// @route POST /api/services
const createService = async (req, res, next) => {
  try {
    const data = req.body

    const doc = {
      _type: 'service',
      name: data.name,
      serviceType: data.serviceType,

      activelocations: data.locationIds.map(id => ({
        _type: 'reference',
        _ref: id
      })),

      activityArea: data.activityArea,
      shortDescription: data.shortDescription,

      contactInfo: {
        contactName: data.contactName,
        phoneNumber: data.phoneNumber,
        email: data.email
      },

      regions: data.regions,
      abilityLevels: data.abilityLevels,

      listOfServices: data.listOfServices,

      urls: data.urls,

      isPublished: false
    }

    const result = await client.create(doc)

    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

module.exports = { createService }