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

describe("Professionals Endpoints", () => {
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

  describe("Professionals: POST requests", () => {
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

  describe("Professionals: PATCH request", () => {
    test("should return 200 okay when sent a successful PATCH request", () => {
      return request(app)
        .patch("/api/professionals/CP871095")
        .send({ availableHours: [] })
        .expect(200);
    });
    test("should return the updated professional", () => {
      return request(app)
        .patch("/api/professionals/CP871095")
        .send({
          availableHours: [
            { day: "monday", hours: [8, 14] },
            { day: "tuesday", hours: [8, 20] },
            { day: "wednesday", hours: [8, 20] },
            { day: "thursday", hours: [8, 20] },
            { day: "friday", hours: [11, 17] },
          ],
        })
        .expect(200)
        .then((response) => {
          expect(response._body.updatedProfessional.availableHours).toEqual([
            { day: "monday", hours: [8, 14] },
            { day: "tuesday", hours: [8, 20] },
            { day: "wednesday", hours: [8, 20] },
            { day: "thursday", hours: [8, 20] },
            { day: "friday", hours: [11, 17] },
          ]);
        });
    });
    test("should return 404 if the username does not exist", () => {
      return request(app)
        .patch("/api/professionals/CP726398")
        .send({ availableHours: [{ day: "monday", hours: [8, 14] }] })
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Professional not found");
        });
    });
    test("should return a 400 bad request error when passed an empty request body", () => {
      return request(app)
        .patch("/api/professionals/CP871095")
        .send({})
        .expect(400)
        .then((response) => {
          expect(response._body.message).toBe("Bad Request!");
        });
    });
    test("should return a 400 bad request error when passed a request body containing the incorrect key", () => {
      return request(app)
        .patch("/api/professionals/CP871095")
        .send({ username: "Eugenie" })
        .expect(400)
        .then((response) => {
          expect(response._body.message).toBe("Bad Request!");
        });
    });
    test("should return a 400 bad request error when passed a request body containing extra keys", () => {
      return request(app)
        .patch("/api/professionals/CP871095")
        .send({ username: "Eugenie", availableHours: [] })
        .expect(400)
        .then((response) => {
          expect(response._body.message).toBe("Bad Request!");
        });
    });
    test("should return a 400 bad request error when passed an incorrect data type to the availableHours key", () => {
      return request(app)
        .patch("/api/professionals/CP871095")
        .send({
          availableHours: { day: "monday", hours: [8, 14] },
        })
        .expect(400)
        .then((response) => {
          expect(response._body.message).toBe("Bad Request!");
        });
    });
  });
});

describe("Users Endpoints", () => {
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
});

describe("Mood Data Endpoints", () => {
  describe("GET /api/mood_data/:username", () => {
    it("should return status 200 with the correct mood data ", () => {
      return request(app)
        .get("/api/mood_data/Tom")
        .expect(200)
        .then(({ body }) => {
          const { moodData } = body;
          expect(moodData).toHaveProperty("username", "Tom");
          expect(moodData).toHaveProperty("date_joined", "03/02/2023");
          expect(moodData).toHaveProperty("mood_data");
          expect(Array.isArray(moodData.mood_data)).toBe(true);
          expect(moodData.mood_data[0]).toEqual({ "03/02/2023": 1 });
        });
    });
    it("should return 404 if username is not found", () => {
      return request(app)
        .get("/api/mood_data/9999")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("username not found");
        });
    });
  });
  describe("PATCH - Mood Data", () => {
    test("Should return 200 status code", () => {
      return request(app)
        .patch("/api/mood_data/Tom")
        .send({ "21/02/2023": 3 })
        .expect(200);
    });
    test("Should return updated user object when new mood data added", () => {
      return request(app)
        .patch("/api/mood_data/Tom")
        .send({ "21/02/2023": 3 })
        .expect(200)
        .then((response) => {
          const updatedMoodData = response._body.updatedMoodData.mood_data;
          expect(updatedMoodData).toEqual([
            { "03/02/2023": 1 },
            { "04/02/2023": 1 },
            { "05/02/2023": 0 },
            { "06/02/2023": -1 },
            { "07/02/2023": 1 },
            { "08/02/2023": 2 },
            { "09/02/2023": 3 },
            { "10/02/2023": 2 },
            { "11/02/2023": 1 },
            { "12/02/2023": 0 },
            { "13/02/2023": -2 },
            { "14/02/2023": 0 },
            { "15/02/2023": 1 },
            { "16/02/2023": 3 },
            { "17/02/2023": 2 },
            { "18/02/2023": 1 },
            { "21/02/2023": 3 },
          ]);
        });
    });
    test("should return 404 if the username does not exist", () => {
      return request(app)
        .patch("/api/mood_data/jhadkjhasdkjha")
        .send({ "21/02/2023": 3 })
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("username not found");
        });
    });
    test("Should return '400 - Bad Request' when sent an empty object on the request body", () => {
      return request(app)
        .patch("/api/mood_data/Tom")
        .send({})
        .expect(400)
        .then((response) => {
          expect(response._body.message).toBe(
            "PATCH requests must be of format { 'DD/MM/YYYY': mood }"
          );
        });
    });
    test("Should return '400 - Bad Request' when sent request body with incorrect key", () => {
      return request(app)
        .patch("/api/mood_data/Tom")
        .send({ username: "Jack" })
        .expect(400)
        .then((response) => {
          expect(response._body.message).toBe(
            "PATCH requests must be of format { 'DD/MM/YYYY': mood }"
          );
        });
    });
    test("Should return '400 - Bad Request' when sent incorrectly formatted or invalid date", () => {
      return request(app)
        .patch("/api/mood_data/Tom")
        .send({ "12-34-2452": 2 })
        .expect(400)
        .then((response) => {
          expect(response._body.message).toBe(
            "PATCH requests must be of format { 'DD/MM/YYYY': mood }"
          );
        });
    });
    test("Should return '400 - Bad Request' when sent mood data as invalid data type", () => {
      return request(app)
        .patch("/api/mood_data/Tom")
        .send({ "21/02/2023": "abc" })
        .expect(400)
        .then((response) => {
          expect(response._body.message).toBe(
            "PATCH requests must be of format { 'DD/MM/YYYY': mood }"
          );
        });
    });
    test("Should return '400 - Bad Request' when sent mood rating outside -3 to 3 window", () => {
      return request(app)
        .patch("/api/mood_data/Tom")
        .send({ "21/02/2023": -4 })
        .expect(400)
        .then((response) => {
          expect(response._body.message).toBe(
            "PATCH requests must be of format { 'DD/MM/YYYY': mood }"
          );
        });
    });
  });
  describe("POST /api/mood_data", () => {
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
});

describe("Waiting Room Endpoints", () => {
  describe("Waiting Room GET requests", () => {
    test("Responds with a 200 status code", () => {
      return request(app).get("/api/waiting_room").expect(200);
    });
    test("Responds with an array containing the users in the waiting room", () => {
      return request(app)
        .get("/api/waiting_room")
        .expect(200)
        .then((response) => {
          const usersInWaitingRoom = response._body.usersInWaitingRoom;
          expect(usersInWaitingRoom.length).toBe(3);
          usersInWaitingRoom.map((user) => {
            expect(user).toHaveProperty("_id");
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("sessionID");
            expect(user).toHaveProperty("avatar_url");
            expect(user).toHaveProperty("chatTopics");
            expect(user).toHaveProperty("createdAt");
            expect(user).toHaveProperty("updatedAt");
          });
        });
    });
  });
  describe("Waiting Room POST requests", () => {
    test("should return a 201 - created status", () => {
      return request(app)
        .post("/api/waiting_room")
        .send({
          username: "Luna",
          sessionID: "dsn104uo5m39q329",
          avatar_url:
            "https://images.pexels.com/photos/736508/pexels-photo-736508.jpeg?auto=compress&cs=tinysrgb&w=800",
          chatTopics: "I miss my horses",
          connectionID: "567dhjbkfvggf",
          talkingTo: null,
          isWaiting: false,
          isProfessional: false,
        })
        .expect(201);
    });
    test("should return the user that was added to the waiting room", () => {
      return request(app)
        .post("/api/waiting_room")
        .send({
          username: "Luna",
          sessionID: "dsn104uo5m39q329",
          avatar_url:
            "https://images.pexels.com/photos/736508/pexels-photo-736508.jpeg?auto=compress&cs=tinysrgb&w=800",
          chatTopics: "I miss my horses",
          connectionID: "567dhjbkfvggf",
          talkingTo: null,
          isWaiting: false,
          isProfessional: false,
        })
        .expect(201)
        .then((response) => {
          const userInWaitingRoom = response._body.newUserInWaitingRoom;
          expect(userInWaitingRoom).toHaveProperty("_id", expect.any(String));
          expect(userInWaitingRoom.username).toBe("Luna");
          expect(userInWaitingRoom.sessionID).toBe("dsn104uo5m39q329");
          expect(userInWaitingRoom.avatar_url).toBe(
            "https://images.pexels.com/photos/736508/pexels-photo-736508.jpeg?auto=compress&cs=tinysrgb&w=800"
          );
          expect(userInWaitingRoom.chatTopics).toBe("I miss my horses");
          expect(userInWaitingRoom.connectionID).toBe("567dhjbkfvggf");
          expect(userInWaitingRoom.talkingTo).toBe(null);
          expect(userInWaitingRoom.isWaiting).toBe(false);
          expect(userInWaitingRoom.isProfessional).toBe(false);
        });
    });
    test("should return 400 when passed an empty request body", () => {
      return request(app)
        .post("/api/waiting_room")
        .send({})
        .expect(400)
        .then((response) => {
          expect(response._body.message).toBe("400 - Bad Request");
          expect(response._body.errorFields).toEqual([
            "username",
            "sessionID",
            "avatar_url",
            "connectionID",
            "isWaiting",
            "isProfessional",
          ]);
        });
    });
    test("should return a 400 error code with the message 400 - Bad Request when passed an incomplete request body", () => {
      return request(app)
        .post("/api/waiting_room")
        .send({
          avatar_url: "testurl.com",
        })
        .expect(400)
        .then((response) => {
          expect(response._body.message).toBe("400 - Bad Request");
          expect(response._body.errorFields).toEqual([
            "username",
            "sessionID",
            "connectionID",
            "isWaiting",
            "isProfessional",
          ]);
        });
    });
  });
  describe("Waiting Room DELETE requests", () => {
    test("should return 204 no content", () => {
      return request(app).delete("/api/waiting_room/Tom").expect(204);
    });
    test("should user is removed from Waiting Room collection", () => {
      return request(app)
        .delete("/api/waiting_room/Tom")
        .expect(204)
        .then(() => {
          return request(app)
            .get("/api/waiting_room")
            .then((res) => {
              expect(
                res._body.usersInWaitingRoom.filter(
                  (user) => user.username === "Tom"
                ).length
              ).toBe(0);
            });
        });
    });
    test("should user is removed from Waiting Room collection", () => {
      return request(app)
        .delete("/api/waiting_room/Timmy")
        .expect(204)
        .then((res) => {
          console.log(res);
        });
    });
  });
});
