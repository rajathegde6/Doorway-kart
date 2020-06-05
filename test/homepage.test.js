var request = require('supertest');
var app = require('../index');

describe("freelancemantra", function () {
    it("ho me page of the website ", function (done) {
        request(app).get("/")
        .expect(200,done)
    })

})

describe("fashion catagory ", function () {
    it("displays products under fashion catag", function (done) {
        request(app).get("/fashionproducts")
            .expect(200, done)
    })

})
describe("all catagory ", function () {
    it("displays products of any catag", function (done) {
        request(app).get("/shop")
            .expect(200, done)
    })

})
describe("electronics catagory catagory ", function () {
    it("displays products of electronics catag", function (done) {
        request(app).get("/electronicsproduct")
            .expect(200, done)
    })

})
describe("authenticATE user", function () {
    it("authenticate user and redirects to user homepage", function (done) {
        request(app).post("/controllers/authenticate-controller")
            .send({"email":"rajathegde6@gmail.com","password":"rajarani420@"},done)
            .expect(302, done)
    })

})