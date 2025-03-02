# Mutual Fund API Documentation

## Authentication APIs

### 1. Create User
**Endpoint:** `POST /api/user/createuser`
**Description:** Registers a new user.

#### Request Body:
```json
{
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "Test@1234"
}
```
#### Response:
**201 Created**
```json
{
    "message": "User Successfully created ",
    "data": []
}
```
**400 Bad Request (Validation Failed)**
```json
{
    "message": "Validation Failed",
    "data": ["password should be at least 7 characters"]
}
```

---

### 2. Authenticate User & Get Token
**Endpoint:** `POST /api/user/authenticate`
**Description:** Authenticates a user and returns a JWT token.

#### Request Body:
```json
{
    "email": "testuser@example.com",
    "password": "Test@1234"
}
```
#### Response:
**200 OK**
```json
{
    "message": "user exists ",
    "data": [{ "token": "your_jwt_token" }]
}
```
**403 Forbidden (Invalid Credentials)**
```json
{
    "message": "Invalid Login Credentials",
    "data": []
}
```

---

## Mutual Fund APIs

### 3. Get List of Fund Houses
**Endpoint:** `GET /api/fund/list-funds`
**Description:** Fetches all mutual fund houses.
**Auth Required:** Yes (Send token in `Authorization` header)

#### Headers:
```json
{
    "Authorization": "your_jwt_token"
}
```
#### Response:
**200 OK**
```json
{
    "message": "working validated",
    "data": [{ "fundHouses": ["Axis Mutual Fund", "HDFC Mutual Fund"] }]
}
```

---

### 4. Get Open Schemes for a Fund Family
**Endpoint:** `POST /api/fund/list-open-ended-scheme`
**Description:** Fetches open-ended schemes for a specific mutual fund family.
**Auth Required:** Yes

#### Request Body:
```json
{
    "family": "Axis Mutual Fund"
}
```
#### Response:
**200 OK**
```json
{
    "message": "these are the open scheme",
    "data": [{ "Scheme_Name": "Axis Banking & PSU Debt Fund", "Net_Asset_Value": 1038.5219 }]
}
```
**403 Forbidden (Validation Failed)**
```json
{
    "message": "Validation Failed",
    "data": ["family is required"]
}
```

---

### 5. Add Scheme to User’s Portfolio
**Endpoint:** `POST /api/fund/add-scheme`
**Description:** Adds a scheme to the authenticated user's investment portfolio.
**Auth Required:** Yes

#### Request Body:
```json
{
    "scheme_code": 120437,
    "units": 10
}
```
#### Response:
**201 Created**
```json
{
    "message": "added the following scheme to portfolio",
    "data": [{ "scheme_code": 120437, "units": 10 }]
}
```
**500 Internal Server Error**
```json
{
    "message": "something went wrong"
}
```

---

### 6. Get User Portfolio Value
**Endpoint:** `GET /api/fund/get-portfolio`
**Description:** Fetches the user's current portfolio with investment values.
**Auth Required:** Yes

#### Response:
**200 OK**
```json
{
    "message": "This is the data",
    "data": [{ "totalPortfolioValue": 100000, "investment": [{ "schemeCode": 120437, "currentNAV": 1038.52, "units": 10, "totalValue": 10385.2 }] }]
}
```
**403 Forbidden (Invalid Token)**
```json
{
    "message": "Invalid token"
}
```

---

## Authentication & Security
- All protected routes require `Authorization` header with a valid token.
- Tokens should be passed without 'Bearer' prefix.
- If an invalid token is provided, API will return `403 Forbidden`.

---

### Notes:
- All endpoints return JSON responses.
- API uses `Joi` for request validation; invalid requests will return `403 Forbidden` with an error message.
- Error messages help debug incorrect API usage.

