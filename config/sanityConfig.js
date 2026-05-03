const sanityClient = require('@sanity/client');
const sanityKey = process.env.SANITY_AUTH_KEY
const sanityDataset = process.env.DATASET
sanityProjectId = process.env.PROJECT_ID

const client = sanityClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: "2022-05-11",
    token: sanityKey,
    useCdn: true
})

module.exports = client;