const request = require("supertest");
const app = require("../index"); // Import your Express app
const db = require("./../utils/dbConfig");
const util = require("util");
const query = util.promisify(db.query).bind(db);

// Mock user data
const newUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "Test@1234" //joi validation here kept 7 min length 
};

const invalidUser = {
    email: "wrong@example.com",
    password: "wrongdP"
};

// Before running tests, reset database if needed
beforeAll(async () => {
    await query("DELETE FROM user WHERE userEmail = ?", [newUser.email]); // Remove test user if exists
});

// After all tests, close database connection
afterAll(async () => {
    const endPool = util.promisify(db.end).bind(db); 
    await endPool(); 
});

describe("User Authentication API Tests", () => {
    /** Assetive Test: Register a New User */
    it("should create a new user", async () => {
        const res = await request(app)
            .post("/api/user/createuser")
            .send(newUser)
            .expect(201); // Expect success status

        expect(res.body).toHaveProperty("message", "User Successfullu created ");
    });

    /** Fail Test: Registering with an Existing Email */
    it("should not allow duplicate email", async () => {
        const res = await request(app)
            .post("/api/user/createuser")
            .send(newUser)
            .expect(200);

        expect(res.body.message).toContain("user already exist");
    });

    /** Assertive Test: Authenticate a Valid User */
    it("should authenticate an existing user and return a token", async () => {
        const res = await request(app)
            .post("/api/user/authenticate")
            .send({ email: newUser.email, password: newUser.password })
            .expect(200);

        expect(res.body.message).toBe("user exists ");
        expect(res.body.data[0]).toHaveProperty("token"); // Ensure a token is returned
    });

    /** Fail Test: Authenticate with Invalid Credentials */
    it("should not authenticate with incorrect credentials", async () => {
        const res = await request(app)
            .post("/api/user/authenticate")
            .send(invalidUser)
            .expect(200);

        expect(res.body.message).toBe("Invalid Login Credentials");
    });

    /** Fail Test: Authenticate with Missing Fields */
    it("should fail when required fields are missing", async () => {
        const res = await request(app)
            .post("/api/user/authenticate")
            .send({ email: "" }) // Missing password
            .expect(403);// Joi validation should return 400

        expect(res.body).toHaveProperty("message");
    });
});
