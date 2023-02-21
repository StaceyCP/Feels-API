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

describe("GET /api/users/:username", () => {
  it("should return 200 with the correct user object", () => {
    return request(app)
      .get("/api/users/Tom")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toHaveProperty("username", "Tom");
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
        const { message } = body;
        expect(message).toBe("id not found");
      });
  });
});

describe("POST /api/users", () => {
  it("Should return 201 with the created user", () => {
    const newUser = {
      username: "TestName",
      email: "testEmail@email.com",
      date_of_birth: "01/01/2001",
      avatar_url: "http://testurl.com",
    };
    const todayDate = new Date()
      .toISOString()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("/");
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toHaveProperty("username", "TestName");
        expect(user).toHaveProperty("email", "testEmail@email.com");
        expect(user).toHaveProperty("date_of_birth", "01/01/2001");
        expect(user).toHaveProperty("avatar_url", "http://testurl.com");
        expect(user).toHaveProperty("date_joined", todayDate);
      });
  });
  it("should return 400 if the new user has missing keys", () => {
    const newUser = {
      username: "TestName",
      email: "testEmail@email.com",
      date_of_birth: "01/01/2001",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("User validation failed");
      });
  });
  it("should return 422 error if the username is not unique", () => {
    const newUser = {
      username: "Tom",
      email: "testEmail@email.com",
      date_of_birth: "01/01/2001",
      avatar_url: "http://testurl.com",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(422)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Key must be unique");
      });
  });
  it("should return 400 error if a key has incorrect data type", () => {
    const newUser = {
      username: "TestUser",
      email: { email: "testEmail@email.com" },
      date_of_birth: "01/01/2001",
      avatar_url: "http://testurl.com",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("User validation failed");
      });
  });
});
