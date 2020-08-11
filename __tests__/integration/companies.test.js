const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const db = require("../../db");
const { notify } = require("../../app");
const VALID_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsQG5vdC1yZWFsLmNvbSIsImlhdCI6MTU5NzEzMDcxNX0.1MSF8_KZsELTBbiEAAX720P5dfTQ2VB_XGcmx3OU75I"

describe("Test getting companies from company routes", function () {
  it("should display all companies in db", async function () {
    let response = await request(app)
      .get("/companies")
      .send({ _token: VALID_TOKEN });

    expect(response.statusCode).toEqual(200);
  });
  it("should not display all companies in db -  bad auth", async function () {
    let response = await request(app)
      .get("/companies")
      .send({ _token: "123" });

    expect(response.statusCode).toEqual(200);
  });
});

describe("Test adding companies to company routes", function () {

  it("should not create new company", async function () {
    let response = await request(app)
      .post("/companies")
      .send({
        handle: "fake",
        name: "Fake_Apple",
        num_employees: "100000",
        description: "Hardware and Software",
        logo_url: "http://www.industrialmarketer.com/wp-content/uploads/2016/05/Apple_Logo.png"
      });

    expect(response.statusCode).not.toEqual(200);
  });

  it("should create new company", async function () {
    let response = await request(app)
      .post("/companies")
      .send({
        _token: VALID_TOKEN,
        handle: "fake12",
        name: "Fake_Apple",
        num_employees: 100000,
        description: "Hardware and Software",
        logo_url: "http://www.industrialmarketer.com/wp-content/uploads/2016/05/Apple_Logo.png"
      });

    expect(response.statusCode).toEqual(201);
  });
});

describe("Get a specific company", async function())

afterAll(async function () {
  await db.end();
});
