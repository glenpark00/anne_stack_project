const express = require('express');
const router = express.Router();
const neo4jCalls = require('../neo4j_api');

router.get('/:id', async function (req, res) {
  console.log(req.params)
  let result = await neo4jCalls.getListing(req.params.id);
  console.log("RESULT IS", result)
  res.status(200).send({ result })    //Can't send just a Number; encapsulate with {} or convert to String.     
  return { result };
})

router.post('/', async function (req, res) {
  // console.log(req.body)
  let listing = await neo4jCalls.createListing(req.body);
  res.status(200).send("Listing named " + listing + " created")
  return 700000;
})

router.post('/seed', async function(req, res) {
  let listings = await neo4jCalls.populateListings().then(() => {
    neo4jCalls.populateReviews()
  })
  res.status(200).send("Database seeded")
})

router.delete('/drop', async function (req, res) {
  let listings = await neo4jCalls.wipeDatabase();
  res.status(200).send("Database dropped")
})

module.exports = router;