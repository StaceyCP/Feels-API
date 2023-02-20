const seed = require("../db/seed/seed");
const testData = require("../db/data/test-data");
const { app } = require("../app");
const request = require("supertest");
const { db } = require("../db/connection");
const { beforeEach } = require("node:test");
const mongoose = require("mongoose");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return mongoose.connection.close();
});

describe("Test test suite", () => {
  test("Husky testing", () => {
    expect("husky").toBe("husky");
  });
});
