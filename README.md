POSTMAN COLLECTION : https://www.postman.com/blue-shuttle-214112/mutualfundapi/collection/iw10mtf/mutual-fund-api?action=share&creator=20089296

# Mutual Fund App

## Overview

This is a backend application for managing mutual fund investments. It allows users to register, authenticate, fetch mutual fund data, add funds to their portfolio, and track their investments.

## Features

- User authentication (JWT-based)
- Fetch mutual fund houses from RapidAPI
- Fetch open-ended schemes for selected fund families
- Add investment schemes to a user portfolio
- View the current value of a user's portfolio

---

## Prerequisites

Ensure you have the following installed:

- Node.js (>= 16.x)
- MySQL 

---

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/mutualFundApp.git
cd mutualFundApp/backend
```

### 2. Install Dependencies

```sh
npm ci
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` folder and add the following:

```
 dbhost = "localhost"
    dbuser = "root" 
    dbpassword ="12345"
    dbdatabase ="mutualfund"
     port = 3000
    secret = "mXnYoZp"
     rapidApiKey = "cadd79b85amshbcb590106878fcbp1acf77jsn260febb808b3"

    NODE_ENV=dev || test (when running test)

```

Replace placeholders with your actual credentials. The Rapid api key - to obtain one login to rapid api and subcribe to "latest-mutual-fund-nav" by suneet kumar , here's the (link)[link https://rapidapi.com/suneetk92/api/latest-mutual-fund-nav]

### 4. Setup Database

Run the following SQL queries to create necessary tables:

```sql
CREATE TABLE
  userfunds (
    id int NOT NULL AUTO_INCREMENT,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    userId int DEFAULT NULL,
    schemeCode int DEFAULT NULL,
    units varchar(255) DEFAULT NULL,
    schemeName varchar(255) DEFAULT NULL,
    PRIMARY KEY (id),
    KEY userfunds_relation_1 (userId),
    CONSTRAINT userfunds_relation_1 FOREIGN KEY (userId) REFERENCES user (id)
  ) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

CREATE TABLE
  user (
    id int NOT NULL AUTO_INCREMENT,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    userName varchar(255) DEFAULT NULL,
    userEmail varchar(255) DEFAULT NULL,
    userPassword varchar(255) DEFAULT NULL,
    PRIMARY KEY (id)
  ) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

CREATE TABLE
  fundfamilies (
    id int unsigned NOT NULL AUTO_INCREMENT,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fundFamilies longtext,
    PRIMARY KEY (id)
  ) ENGINE = InnoDB AUTO_INCREMENT = 216 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci
```

### 5. Start the Server

```sh
npm start
```

Server will be running on `http://localhost:3000`

---

## Running Tests

```sh
npm test
```


