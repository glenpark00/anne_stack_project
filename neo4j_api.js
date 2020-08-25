const neo4j = require('neo4j-driver');
const creds = require('./config/credentials');

const driver = new neo4j.driver('bolt://localhost:7687', neo4j.auth.basic(creds['neo4jusername'], creds['neo4jpw']));

exports.getListing = async id => {
  let session = driver.session();
  const listing = await session.run('MATCH (l:Listing) WHERE ID(l) = $id  RETURN l', { id: parseInt(id) });
  session.close();
  console.log(listing)
  console.log("RESULT", listing.name);
  return listing.records[0].get(0).properties;
}

exports.createListing = async (details) => {
  let session = driver.session();
  let listing = "No Listing Was Created";
  try {
    listing = await session.run('MERGE (n:Listing {name: $name, hostName: $hostName, neighborhood: $neighborhood, roomType: $roomType, price: $price}) RETURN n', details);
    // console.log(listing.records[0].get(0).properties.name)
  }
  catch (err) {
    console.error(err);
    return listing;
  }
  return listing.records[0].get(0).properties.name;
}

exports.populateListings = async () => {
  let session = driver.session();
  // MERGE ensures node being created is unique
  const listings = await session.run(
    'USING PERIODIC COMMIT 500 LOAD CSV WITH HEADERS FROM "file:///listings.csv" AS data MERGE (l: Listing {id: data.id, name: data.name, hostName: data.host_name, roomType: data.room_type, price: data.price, numReviews: data.number_of_reviews})');
  session.close();
}

exports.populateReviews = async () => {
  let session = driver.session();
  const reviews = await session.run(
    'USING PERIODIC COMMIT 500 LOAD CSV WITH HEADERS FROM "file:///reviews.csv" AS data MERGE (r: Review {listingId: data.listing_id, date: data.date}) WITH r MATCH (l:Listing) WHERE l.id = r.listingId CREATE (l)-[rel:HAS]->(r)');
  session.close();
}

// exports.populateRelationships = async () => {
//   let session = driver.session();
//   const data = await session.run(
//     'MATCH (l:Listing), (r:Review) WHERE l.id = r.listingId CREATE (l)-[rel:HAS]->(r) RETURN type(rel)');
//   console.log(data)
//   session.close();
// }

exports.wipeDatabase = async () => {
  let session = driver.session();
  const data = await session.run('MATCH (n) DETACH DELETE n');
  session.close();
}