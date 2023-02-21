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

describe("Professionals - end points", () => {
  describe("Professionals: GET requests", () => {
    test("Should return 200 status code", () => {
      return request(app).get("/api/professionals/CP871095").expect(200);
    });
    test("Returns the user with the given registration number", () => {
      return request(app)
        .get("/api/professionals/CP871095")
        .expect(200)
        .then((response) => {
          const professional = response._body.professional;
          expect(professional).toHaveProperty("fullName", "Lilliana Valentina");
          expect(professional).toHaveProperty(
            "email",
            "lilliana_valentina@plt.com"
          );
          expect(professional).toHaveProperty("registrationNumber", "CP871095");
          expect(professional).toHaveProperty(
            "availableHours",
            expect.any(Array)
          );
          expect(professional).toHaveProperty(
            "avatarURL",
            "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=800"
          );
          expect(professional).toHaveProperty("_id", expect.any(String));
        });
    });
    test("Returns 'Status 404 - professional not found' if professional registration number doesn't exist in DB", () => {
      return request(app)
        .get("/api/professionals/CP111111")
        .expect(404)
        .then((response) => {
          expect(response._body.message).toBe("Professional not found");
        });
    });
  });

  describe("Professionals POST requests", () => {
    test("should return 201 status code", () => {
      return request(app)
        .post("/api/professionals")
        .send({
          fullName: "David Barker",
          email: "davidbarker@skymail.com",
          registrationNumber: "CP780714",
          availableHours: [
            { day: "monday", hours: [13, 20] },
            { day: "tuesday", hours: [13, 22] },
            { day: "wednesday", hours: [10, 16] },
            { day: "thursday", hours: [13, 20] },
            { day: "friday", hours: [9, 18] },
          ],
          avatarURL:
            "https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&cs=tinysrgb&w=800",
        })
        .expect(201);
    });
    test("should return the newly created professional", () => {
      return request(app)
        .post("/api/professionals")
        .send({
          fullName: "David Barker",
          email: "davidbarker@skymail.com",
          registrationNumber: "CP780714",
          availableHours: [
            { day: "monday", hours: [13, 20] },
            { day: "tuesday", hours: [13, 22] },
            { day: "wednesday", hours: [10, 16] },
            { day: "thursday", hours: [13, 20] },
            { day: "friday", hours: [9, 18] },
          ],
          avatarURL:
            "https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&cs=tinysrgb&w=800",
        })
        .expect(201)
        .then((response) => {
          const newProfessional = response._body.newProfessional;
          expect(newProfessional).toHaveProperty("fullName", "David Barker");
          expect(newProfessional).toHaveProperty(
            "email",
            "davidbarker@skymail.com"
          );
          expect(newProfessional).toHaveProperty(
            "registrationNumber",
            "CP780714"
          );
          expect(newProfessional).toHaveProperty("availableHours");
          expect(newProfessional).toHaveProperty("avatarURL");
          expect(newProfessional).toHaveProperty("_id", expect.any(String));
        });
    });
    test("should return 400 when passed an empty request body", () => {
      return request(app)
        .post("/api/professionals")
        .send({})
        .expect(400)
        .then((response) => {
          expect(response._body.message).toBe("400 - Bad Request");
          expect(response._body.errorFields).toEqual([
            "fullName",
            "email",
            "registrationNumber",
            "avatarURL",
          ]);
        });
    });
    test("should return a 400 error code with the message 400 - Bad Request when passed an incomplete request body", () => {
      return request(app)
        .post("/api/professionals")
        .send({
          fullName: "David Barker",
          email: "davidbarker@skymail.com",
          availableHours: [
            { day: "monday", hours: [13, 20] },
            { day: "tuesday", hours: [13, 22] },
            { day: "wednesday", hours: [10, 16] },
            { day: "thursday", hours: [13, 20] },
            { day: "friday", hours: [9, 18] },
          ],
        })
        .expect(400)
        .then((response) => {
          expect(response._body.message).toBe("400 - Bad Request");
          expect(response._body.errorFields).toEqual([
            "registrationNumber",
            "avatarURL",
          ]);
        });
    });
    test("should return a 400 error when passed a registrationNumber is the incorrect format", () => {
      return request(app)
        .post("/api/professionals")
        .send({
          fullName: "David Barker",
          email: "davidbarker@skymail.com",
          registrationNumber: "CP871095",
          availableHours: [
            { day: "monday", hours: [13, 20] },
            { day: "tuesday", hours: [13, 22] },
            { day: "wednesday", hours: [10, 16] },
            { day: "thursday", hours: [13, 20] },
            { day: "friday", hours: [9, 18] },
          ],
          avatarURL:
            "https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&cs=tinysrgb&w=800",
        })
        .expect(422)
        .then((response) => {
          expect(response._body.message).toBe("Key must be unique");
        });
    });
    test("should return a 400 error when passed a registrationNumber that is already in the db", () => {
      return request(app)
        .post("/api/professionals")
        .send({
          fullName: "David Barker",
          email: "davidbarker@skymail.com",
          registrationNumber: 871095,
          availableHours: [
            { day: "monday", hours: [13, 20] },
            { day: "tuesday", hours: [13, 22] },
            { day: "wednesday", hours: [10, 16] },
            { day: "thursday", hours: [13, 20] },
            { day: "friday", hours: [9, 18] },
          ],
          avatarURL:
            "https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&cs=tinysrgb&w=800",
        })
        .expect(400)
        .then((response) => {
          expect(response._body.message).toBe(
            "registration number is not the correct format"
          );
        });
    });
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
        expect(message).toBe("username not found");
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
        expect(message).toBe("400 - Bad Request");
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
        expect(message).toBe("400 - Bad Request");
      });
  });
});

describe("POST /api/mood_data/", () => {
  it("should return 201 with the new moodData object", () => {
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
      .then(() => {
        return request(app)
          .post("/api/mood_data")
          .send({ username: newUser.username })
          .expect(201);
      })
      .then(({ body }) => {
        const { moodData } = body;
        expect(moodData).toHaveProperty("username", "TestName");
        expect(moodData).toHaveProperty("date_joined", todayDate);
        expect(moodData).toHaveProperty("mood_data");
        expect(moodData.mood_data).toEqual([]);
      });
  });

  it("should return 404 if the username does not exist", () => {
    return request(app)
      .post("/api/mood_data")
      .send({ username: "jhadkjhasdkjha" })
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("username not found");
      });
  });

  it("should return 400 if the data type for username is incorrect", () => {
    return request(app)
      .post("/api/mood_data")
      .send({ username: { username: "ahdsjdid" } })
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe(
          'Cast to string failed for value "{ username: \'ahdsjdid\' }" (type Object) at path "username" for model "User"'
        );
      });
  });
});
