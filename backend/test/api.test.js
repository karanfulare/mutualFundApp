const request = require("supertest");
const app = require("../index"); 

describe("API Tests", () => {
    it("should return a 404 for an invalid route", async () => {
        const res = await request(app).get("/invalid-route");
        expect(res.status).toBe(404);
    });
});
