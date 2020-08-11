const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const VALID_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsQG5vdC1yZWFsLmNvbSIsImlhdCI6MTU5NzEzNjYwNn0.j4w-ar_UI2mSS9GrL0OwLeBX - hj0RGWqoNJi9bB7IXg"


describe("Testing GET requests on Jobs", function () {
  it("should display all jobs in db", async function () {
    let response = await request(app)
      .get("/jobs")
      .send({ _token: VALID_TOKEN })

    expect(response.statusCode).toEqual(200);
  });

  it("should get a single job", async function () {
    let response = await request(app)
      .get("/jobs/1")
      .send({ _token: VALID_TOKEN })

    expect(response.statusCode).toEqual(200);
  });
});

describe("Testing create request on Jobs", function () {
  it("should create job", async function () {
    let response = await request(app)
      .post("/jobs")
      .send({
        _token: VALID_TOKEN,
        title: "Software Engineer",
        salary: 100000,
        equity: 0,
        date_posted: "Jul 17, 2020",
        company_handle: "apple",
        listing_url: "https://jobs.apple.com/en-us/details/200181795/software-engineer-apple-pay"
      })

    expect(response.statusCode).toEqual(201);
  });

  it("should update a single job", async function () {
    let response = await request(app)
      .patch("/jobs/1")
      .send({
        _token: VALID_TOKEN,
        salary: 40000,
      });

    expect(response.statusCode).toEqual(200);
  });

  it("should delete a single job", async function () {
    let response = await request(app)
      .delete("/jobs/2")
      .send({
        _token: VALID_TOKEN,
      });

    expect(response.statusCode).toEqual(200);
  });
});

