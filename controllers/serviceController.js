const client = require('../config/sanityConfig')
const { buildLocation } = require('./locationController')

// @desc Create Service
// @route POST /api/services
function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0,96)
}

const SERVICE_FIELDS = [
  'name', 'serviceType', 'activityArea', 'shortDescription', 'accessibilityInfo',
  'contactInfo', 'abilityLevels', 'listOfServices', 'insurance', 'seasonalSchedule',
  'longerDescription', 'urls', 'qualifications', 'safetyForGroups', 'safetyForBusinesses',
  'isAccessible', 'isBeginnerFriendly', 'image',
]

const SERVICE_TYPES_REQUIRING_LIST = ['business', 'coach']

const pick = (obj, allowed) =>
  Object.fromEntries(Object.entries(obj ?? {}).filter(([k]) => allowed.includes(k)))

const createService = async (req, res, next) => {
  const body = req.body
  if(typeof body.name !== 'string' || !body.name.trim()) {
    return res.status(400).json({error: "Name is required and it must be string"})
  }
    if (!Array.isArray(body.serviceType) || body.serviceType.length === 0) {
    return res.status(400).json({ error: 'At least one service type is required' })
  }
  if (!Array.isArray(body.activelocations) || body.activelocations.length === 0) {
    return res.status(400).json({ error: 'At least one active location is required' })
  }
  const needsServiceList = body.serviceType.some(t => SERVICE_TYPES_REQUIRING_LIST.includes(t))
  if (needsServiceList && (!Array.isArray(body.listOfServices) || body.listOfServices.length === 0)) {
    return res.status(400).json({ error: 'A List of Services is required for Coaches and Businesses' })
  }

  const locationDocs = []
  const locationRefs = []

  for(const raw of body.activelocations) {
    const {doc, reference, error} = buildLocation(raw, body.name.trim())
    if (error) {
      return res.status(400).json({error})
    }
    locationDocs.push(doc)
    locationRefs.push(reference)
  }

  
  const service = {
    ...pick(body, SERVICE_FIELDS),
    _type: 'service',
    slug: { _type: 'slug', current: createSlug(body.name) },
    isPublished: false, //never from client
    activelocations: locationRefs, //location references directly
  }
  
  
  try {
    const tx = client.transaction()
    locationDocs.forEach((doc) => tx.create(doc))
    tx.create(service)
    const result = await tx.commit()
    //result.documentIds contains every created id; the service is the last create
    res.status(201).json({ id: result.documentIds[result.documentIds.length - 1] })
  } catch (error) {
    console.error('Sanity transaction error', error)
    next(error)
  }
}

//get all services
const getAllServices = async (req, res, next) => {
  console.log('Fetching all services');
  try {
    const query = `*[_type == "service" && isPublished == true]{
      _id,
      _type,
      "slug": slug.current,
      "type": serviceType[0],
      "name": name, 
      "description":  pt::text(shortDescription),
      isAccessible,
      isBeginnerFriendly,
      "imageUrl": image.asset->url,
      "activelocations": activelocations[]->{
        placeName,
        what3words,
        region,
        accessibilityDescription,
        "latitude": geopoint.lat,
        "longitude": geopoint.lng
      }
    }`
    const services = await client.fetch(query)
    res.status(200).json(services)
  } catch (error) {
    console.error('Error fetching services', error)
    next(error)
  }
}
//get search matches
const getSearchMatches = async (req, res, next) => {
  console.log('Fetching search matches');
  try {
    const { query } = req.params
    const searchQuery = `*[_type == "service" && isPublished == true && (name match $query || description match $query || serviceType match $query || activityArea match $query || listOfServices[] match $query)]{
      _id,
      _type,
      "slug": slug.current,
      "type": serviceType[0],
      "name": name,
      "description": pt::text(shortDescription),
      isAccessible,
      isBeginnerFriendly,
      "imageUrl": image.asset->url,
      "activelocations": activelocations[]->{
        placeName,
        what3words,
        region,
        accessibilityDescription,
        "latitude": geopoint.lat,
        "longitude": geopoint.lng
      }
    }`
    const services = await client.fetch(searchQuery, { query })
    res.status(200).json(services)
  } catch (error) {
    console.error('Error fetching search matches', error)
    next(error)
  }
}

//get service by slug
const getServiceBySlug = async (req, res, next) => {
  console.log('Fetching service by slug');
  try {
    const { slug } = req.params
    const query = `*[_type == "service" && slug.current == $slug][0]{
            _id,
            "type": serviceType[0],
            "placeName": name,
            safetyForBusinesses,
            "description": pt::text(longerDescription),
            "shortDescription": pt::text(shortDescription),
            "qualifications": qualifications,
            "contactInfo": {
                "phoneNumber": contactInfo.phoneNumber,
                "email": select(
                    contactInfo.isEmailPublic == true => contactInfo.email,
                    null
                )
            },
            urls,
            listOfServices[],
            "accessibility": pt::text(accessibilityInfo),
            "imageUrl": image.asset->url,
            "activelocations": activelocations[]->{
                placeName,
                region,
                "_id": _id,
                "latitude": geopoint.lat,
                "longitude": geopoint.lng,
                accessibilityDescription,
                what3words
            }
        }`
    const service = await client.fetch(query, { slug })
    if (!service) {
      return res.status(404).json({ error: 'Service not found' })
    }
    res.status(200).json(service)
  } catch (error) {
    console.error('Error fetching service', error)
    next(error)
  }
}

//update service by slug
const updateServiceBySlug = async (req, res, next) => {
  console.log('Updating service by slug');
  try {
    const { slug } = req.params
    const updates = req.body
    const query = `*[_type == "service" && slug.current == $slug][0]{
            _id,
            "type": serviceType[0],
            "placeName": name,
            safetyForBusinesses,
            "description": pt::text(longerDescription),
            "shortDescription": pt::text(shortDescription),
            "qualifications": qualifications,
            "contactInfo": {
                "phoneNumber": contactInfo.phoneNumber,
                "email": select(
                    contactInfo.isEmailPublic == true => contactInfo.email,
                    null
                )
            },
            urls,
            listOfServices[],
            "accessibility": pt::text(accessibilityInfo),
            "imageUrl": image.asset->url,
            "activelocations": activelocations[]->{
                placeName,
                region,
                "_id": _id,
                "latitude": geopoint.lat,
                "longitude": geopoint.lng,
                accessibilityDescription,
                what3words
            }
        }`
    const service = await client.fetch(query, { slug })
    if (!service) {
      return res.status(404).json({ error: 'Service not found' })
    }
    const updatedService = { ...service, ...updates }
    const result = await client.patch(service._id).set(updatedService).commit()
    res.status(200).json(result)
  } catch (error) {
    console.error('Error updating service', error)
    next(error)
  }
}

//delete service by slug
const deleteServiceBySlug = async (req, res, next) => {
  console.log('Deleting service by slug');
  try {
    const { slug } = req.params
    const query = `*[_type == "service" && slug.current == $slug][0]{
            _id
        }`
    const service = await client.fetch(query, { slug })
    if (!service) {
      return res.status(404).json({ error: 'Service not found' })
    }
    const result = await client.delete(service._id)
    res.status(200).json(result)
  } catch (error) {
    console.error('Error deleting service', error)
    next(error)
  }
}

module.exports = { createService, getAllServices, getServiceBySlug, updateServiceBySlug, deleteServiceBySlug, getSearchMatches, SERVICE_FIELDS }