const sanityClient = require('@sanity/client');
const sanityKey = process.env.SANITY_TOKEN
const sanityDataset = process.env.SANITY_DATASET
sanityProjectId = process.env.SANITY_PROJECT_ID

const client = sanityClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: "2022-05-11",
    token: sanityKey,
    useCdn: true
})

module.exports = client;