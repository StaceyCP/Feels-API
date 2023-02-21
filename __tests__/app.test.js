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
    // test("should return a 400 error when passed a registrationNumber is the incorrect format", () => {
    //   return request(app)
    //     .post("/api/professionals")
    //     .send({
    //       fullName: "David Barker",
    //       email: "davidbarker@skymail.com",
    //       registrationNumber: "CP871095",
    //       availableHours: [
    //         { day: "monday", hours: [13, 20] },
    //         { day: "tuesday", hours: [13, 22] },
    //         { day: "wednesday", hours: [10, 16] },
    //         { day: "thursday", hours: [13, 20] },
    //         { day: "friday", hours: [9, 18] },
    //       ],
    //       avatarURL:
    //         "https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&cs=tinysrgb&w=800",
    //     })
    //     .expect(400)
    //     .then((response) => {
    //       expect(response._body.message).toBe("registration already in use");
    //     });
    // });
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
