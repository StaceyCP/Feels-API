const { db } = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seed/seed");
const { app } = require("../app");
const request = require("supertest");
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

describe("GET /api/users/:user_id", () => {
  it("should return 200 with the correct user object", () => {
    return request(app)
      .get("/api/users/2")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toHaveProperty("user_id", 2);
        expect(user).toHaveProperty("firstName", "Tom");
        expect(user).toHaveProperty("email", "tommynook@anch.com");
        expect(user).toHaveProperty("date_of_birth", "17/11/1999");
        expect(user).toHaveProperty("date_joined", "03/02/2023");
        expect(user).toHaveProperty(
          "avatar_url",
          "https://images.pexels.com/photos/913390/pexels-photo-913390.jpeg?auto=compress&cs=tinysrgb&w=800"
        );
      });
  });
  it("should return 404 if user id is not found", () => {
    return request(app)
      .get("/api/users/99999")
      .expect(404)
      .then(({ body }) => {
        console.log(body);
        const { message } = body;
        expect(message).toBe("id not found");
      });
  });
});
