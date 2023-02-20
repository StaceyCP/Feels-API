const seed = require("../db/seed/seed");
const testData = require("../db/data/test-data");
const { app } = require("../app");
const request = require("supertest");
const { db } = require("../db/connection");
const mongoose = require("mongoose");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return mongoose.connection.close();
});

describe("Professionals - end points", () => {
  describe("Professionals POST requests", () => {
    test("should return 201 status code", () => {
      return request(app).post("/api/professionals").send({}).expect(201);
    });
  });
});
