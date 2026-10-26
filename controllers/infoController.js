const { json } = require('express');
const client = require('../config/sanityConfig')

//lookup and whitelist
const INFO_TYPES = {
    safety: "safetyInfo",
    about: "about",
    privacy: "privacy",
    terms: "terms",
    cookies: "cookies",
    faq: "faq",
    resources: "resources",
    training: "training",
    groups: "aboutSwimmingGroups",    
}

const infoQuery = `*[_type == "safetyInfo"] | order(mainSectionNumber asc){
    _id,
    mainSectionTitle,
    mainSectionNumber,
    mainSectionText,
    subSections[]{
        _key,
        subSectionTitle,
        subSectionText
    }
}`

const getInfo = async (req, res) => {    
    const type = INFO_TYPES[req.params.page];
    console.log(`${type} info request`)
    if(!type) return res.status(404).json({error: "Page not Found"})
    try {
        const info = await client.fetch(infoQuery, { type })
        res.status(200).json(info)
    } catch (err){
        console.error(`Error fetching ${type} information`, err)
        res.status(500).json({error: `Error fetching ${type} information`})
    }
}

module.exports = {getInfo}