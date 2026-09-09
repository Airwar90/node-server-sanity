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

module.exports = { createService }