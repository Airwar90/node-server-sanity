const client = require('../config/sanityConfig')

const uploadImage = async (req, res, next) => {
  const { image, contentType, filename } = req.body

  if (!image) {
    return res.status(400).json({ message: "No image provided" })
  }

  try {
    const buffer = Buffer.from(image.split(',')[1], 'base64')
    const asset = await client.assets.upload('image', buffer, {
      filename: filename || 'uploaded_image.jpg',
      contentType
    })
    res.status(200).json({ _id: asset._id }) 
  } catch (error) {
    next(error)
  }
}

module.exports = { uploadImage }