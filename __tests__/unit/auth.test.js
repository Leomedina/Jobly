/** Testing for Authentication middleware
 * 
 * Tests:
 *  -> annon-user
 *  -> log-in returns working signed JWT
 *  -> confirms if JWT is equal to passed in user
 * 
 */

const jwt = require("jsonwebtoken");
const request = require("supertest");
const httpMocks = require("node-mocks-http");
const { authenticateJWT, ensureLoggedIn, ensuresCorrectUser } = require("../../middleware/auth");
const app = require("../../app");
const VALID_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsQG5vdC1yZWFsLmNvbSIsImlhdCI6MTU5NzEzMDcxNX0.1MSF8_KZsELTBbiEAAX720P5dfTQ2VB_XGcmx3OU75I"
const db = require("../../db");


describe("TEST: authenticateJWT function", function () {
  it("should response with no user valid if token is unauthorized", async function () {
    let req = await httpMocks.createRequest({
      method: 'GET',
      url: '/users',
      body: {
        _token: "not valid"
      }
    });

    let res = httpMocks.createResponse();
    let next = function (err) { }

    await authenticateJWT(req, res, next);

    expect(req.user).toEqual("no user");
  });
});


describe("POST /users/register", function () {
  test("can register", async function () {
    let response = await request(app)
      .post("/auth/register")
      .send({
        email: "test@email.com",
        password: "secret",
        name: "Leo Medina",
        photo_url: "https://t3.ftcdn.net/jpg/00/64/67/80/240_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg",
        is_admin: false

      });

    let token = response.body.token;
    expect(jwt.decode(token)).toBeNull();
  });
});