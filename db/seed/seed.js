const { db } = require("../connection");
const Professional = require("../profesionalSchema");
const professionalsData = require("../data/test-data/professionalsData");
const mongoose = require("mongoose");

function seedProfessionals(data) {
  const collections = Object.keys(mongoose.connections[0].collections);
  let promise = new Promise(() => {});
  if (collections.includes("professionals")) {
    promise = Professional.collection.drop();
  }
  return promise
    .then(() => {
      console.log("Droped collection");
      return Professional.createCollection();
    })
    .then(() => {
      console.log("Collection created");
      return Professional.insertMany(data);
    })
    .then(() => {
      console.log("Data inserted");
    })
    .catch((err) => {
      console.log(err);
    });
}

seedProfessionals(professionalsData);
