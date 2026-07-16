// @desc Create Active Location
const {randomUUID} = require('crypto')

const LOCATION_FIELDS = ["placeName", "what3words", "region", "accessibilityDescription"]
const SCOTLAND_BOUNDS = {
  minLat: 54.6,
  maxLat: 60.9,
  minLng: -7.6,
  maxLng: -0.7,
}

const isInScotland = (lat, lng) =>
  lat >= SCOTLAND_BOUNDS.minLat &&
  lat <= SCOTLAND_BOUNDS.maxLat &&
  lng >= SCOTLAND_BOUNDS.minLng &&
  lng <= SCOTLAND_BOUNDS.maxLng;

  function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0,96)
}

function buildLocation(rawBody, serviceName) {
  if(typeof rawBody !== 'object' || rawBody === null) {
    return {error: 'Location object format error'}
  }
  if(typeof rawBody.placeName !== 'string' || !rawBody.placeName.trim()) {
    return {error: 'Locations must have a place name'}
  }
  const lat = Number(rawBody.lat)
  const lng = Number(rawBody.lng)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return {error: `Location ${rawBody.placeName} had invalid coordinates`}
  }

  //reject locations outside of Scotland
  if(!isInScotland(lat, lng)) {
    return {error: `Location ${rawBody.placeName} is outside of Scotland`}
  }
  if(typeof rawBody.accessibilityDescription !== "string" || !rawBody.accessibilityDescription.trim()) {
    return {error: `Location ${rawBody.placeName} needs accessibility description`}
  }
  const compositeName = `${serviceName} @ ${rawBody.placeName.trim()}`
  const _id = randomUUID();
  const doc = {
    _id,
    _type: 'activeLocation',
    placeName: compositeName,
    geopoint: {_type: 'geopoint', lat, lng},
    accessibilityDescription: rawBody.accessibilityDescription.trim(),
    slug: {_type: 'slug', current: createSlug(compositeName)}
  }

  if (typeof rawBody.region === 'string' && rawBody.region.trim()) doc.region = rawBody.region.trim()
  if (typeof rawBody.what3words === 'string' && rawBody.what3words.trim()) doc.what3words = rawBody.what3words.trim()

  const reference = {_type: 'reference', _ref: _id, _key: randomUUID()}
  return {doc, reference}
}

module.exports = { buildLocation, LOCATION_FIELDS }