const client = require('../config/sanityConfig')

//signature bytes for accepted formats, this is checked against the received file's signature
const IMAGE_SIGNATURES = {  
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  'image/webp': [0x52, 0x49, 0x46, 0x46] // this format's signature as a RIFF start and WEBP end, this is the RIFF part
}

const MAX_SIZE = 10 * 1024 * 1024 //10MB

function checkFileIsAValidImage(file) {
  for (const [type, signature] of Object.entries(IMAGE_SIGNATURES)) {    
    if(signature.every((byte, i) => file[i] === byte)) {
      //check if webp to check second signature part first
      if(type === 'image/webp') {
        const webp = [0x57, 0x45, 0x42, 0x50] //WEBP bytes 8 to 11
        if(webp.every((b, i) => file[8 + i] === b)) 
          return type
        return null
      }
      return type
    }    
  }
  return null
}

const uploadImage = async (req, res, next) => {
  const { image, contentType, fileName } = req.body

  if (!image) {
    return res.status(400).json({ message: "No image provided" })
  }

  try {
    const base64 = image.includes(',') ? image.split(',')[1] : null
    if(!base64) {
      return res.status(400).json({message: "Malformed image data"})
    }

    const buffer = Buffer.from(base64, 'base64')
    if(buffer.length === 0) {
      return res.status(400).json({message: "Empty iamge"})
    }
    if(buffer.length > MAX_SIZE) {
      return res.status(400).json({message: "Image size exceeds 10MB limit"})
    }

    const type = checkFileIsAValidImage(buffer)
    if(!type) {
      return res.status(400).json({message: "The selected file is not a valid JPEG, PNG or WebP image"})
    }

    const asset = await client.assets.upload('image', buffer, {
      filename: fileName || 'uploaded_image.jpg',
      contentType: type
    })
    res.status(200).json({ _id: asset._id }) 
  } catch (error) {
    next(error)
  }
}

module.exports = { uploadImage, checkFileIsAValidImage }