const client = require('../config/sanityConfig')

// @desc Create Active Location
// @route POST /api/locations
const createLocation = async (req, res, next) => {
  try {
    const data = req.body

    const doc = {
      _type: 'activeLocation',
      placeName: data.placeName,
      gaelicName: data.gaelicName,
      what3words: data.what3words,
      region: data.region,
      geopoint: {
        _type: 'geopoint',
        lat: data.lat,
        lng: data.lng
      },
      locationType: data.locationType,
      swimLocationType: data.swimLocationType,
      entryType: data.entryType,
      entrySurface: data.entrySurface,
      postcode: data.postcode,
      description: data.description,
    }

    const result = await client.create(doc)

    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

module.exports = { createLocation }