const request = require("supertest");
const app = require("../index"); // Import Express app
const db = require("../utils/dbConfig");
const util = require("util");
const query = util.promisify(db.query).bind(db);

require("dotenv").config(); // Load environment variables

let token; // Will store the JWT token

// Mock test user
const testUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "Test@1234"
};

// Mock test scheme
const testScheme = {
    scheme_code: 120437,
    units: 10
};

// Mock test fund family
const testFundFamily = { family: "Axis Mutual Fund" };

// **Before all tests, create a test user & get JWT token**
beforeAll(async () => {
    await query("DELETE FROM user WHERE userEmail = ?", [testUser.email]); // Clean DB

    await request(app).post("/api/user/createuser").send(testUser); // Create user

    const loginResponse = await request(app).post("/api/user/authenticate").send({
        email: testUser.email,
        password: testUser.password
    });

    token = loginResponse.body.data[0].token; // Store JWT token
});

// **After all tests, clean up DB**
afterAll(async () => {
    await query("DELETE FROM userFunds WHERE userId IN (SELECT id FROM user WHERE userEmail = ?)", [testUser.email]);
    await query("DELETE FROM user WHERE userEmail = ?", [testUser.email]);

    const endPool = util.promisify(db.end).bind(db);
    await endPool(); // Close DB connection
});

// **Test Cases**
describe("Mutual Fund API Tests", () => {

    /** ✅ Test: Fetch fund houses */
    it("should fetch fund houses", async () => {
        const res = await request(app)
            .get("/api/fund/list-funds")
            .set("Authorization", `${token}`)
            .expect(200);

        expect(res.body).toHaveProperty("message", "working validated");
        expect(res.body.data[0]).toHaveProperty("fundHouses");
    });

    /** ✅ Test: Fetch open schemes for a fund family */
    it("should fetch open schemes for a valid fund family", async () => {
        const res = await request(app)
            .post("/api/fund/list-open-ended-scheme")
            .set("Authorization", `${token}`)
            .send(testFundFamily)
            .expect(200);

        expect(res.body).toHaveProperty("message", "these are the open scheme");
    },10000);

    /** ❌ Test: Fail when sending an invalid fund family */
    it("should return error for invalid fund family", async () => {
        const res = await request(app)
            .post("/api/fund/list-open-ended-scheme")
            .set("Authorization", `${token}`)
            .send({ family: "" }) // Invalid input
            .expect(403);

        expect(res.body).toHaveProperty("message", "Validation Failed");
    });

    /** ✅ Test: Add a scheme to portfolio */
    it("should add a scheme to the user’s portfolio", async () => {
        const res = await request(app)
            .post("/api/fund/add-scheme")
            .set("Authorization", `${token}`)
            .send(testScheme)
            .expect(201);
    
        expect(res.body.message).toContain("added the following scheme to portfolio"); 
        expect(res.body.data[0]).toHaveProperty("scheme_code", testScheme.scheme_code);
    });

    /** ✅ Test: Get portfolio value */
    it("should fetch user’s portfolio", async () => {
        const res = await request(app)
            .get("/api/fund/get-portfolio")
            .set("Authorization", `${token}`)
            .expect(200);

        expect(res.body).toHaveProperty("message", "This is the data");
    });

});
