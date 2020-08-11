const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const db = require("../../db");


describe("Test register from users routes", function () {

  it(" should register successfully", async function () {
    let response = await request(app)
      .post("/users")
      .send({
        email: "email+1@not-real.com",
        password: "password",
        name: "Leo Medina",
        photo_url: "https://t3.ftcdn.net/jpg/00/64/67/80/240_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg",
        is_admin: false
      });

    expect(response.statusCode).toEqual(201);
  });

  it(" should register unsuccessfully", async function () {
    let response = await request(app)
      .post("/users")
      .send({ email: "email@not-real.com", password: "Not password" });

    expect(response.statusCode).not.toEqual(200);
  });
});

describe("test login from users routes", function () {

  it(" should login successfully", async function () {
    let response = await request(app)
      .post("/users/login")
      .send({
        email: "email+1@not-real.com", password: "password"
      });

    expect(response.statusCode).toEqual(200);
  });

  it(" should register unsuccessfully", async function () {
    let response = await request(app)
      .post("/users/login")
      .send({ email: "email@not-real.com", password: "Not password" });

    expect(response.statusCode).not.toEqual(200);
  });

});

afterAll(async function () {
  await db.end();
});
