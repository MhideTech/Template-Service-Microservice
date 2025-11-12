# 🧠 TemplateFlow API (NestJS + TypeORM + JWT Authentication)

TemplateFlow is a full-featured **template management API** built with **NestJS**, **PostgreSQL**, and **TypeORM**.  
It allows you to create, preview, and manage reusable text templates (e.g., email bodies, web content, etc.) with **dynamic variables**, **category validation**, **JWT-based authentication**, and **pagination** support.

---

## 🚀 Features

- 🔐 **JWT Authentication** (`/auth/register`, `/auth/login`)
- 🧩 **Template Management** (CRUD endpoints)
- 🪶 **Template Preview** with dynamic variable rendering (`{{variable | default}}`)
- 🧭 **Category Validation** (supports only valid predefined template types)
- 🔍 **Pagination** for fetching large datasets efficiently
- 🧱 **TypeORM Integration** (PostgreSQL)
- ⚙️ **Global Validation Pipes** for clean request validation
- 🛠️ Built using **NestJS** (Modular Architecture)

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| Backend Framework | [NestJS](https://nestjs.com/) |
| Database ORM | [TypeORM](https://typeorm.io/) |
| Database | PostgreSQL |
| Authentication | JWT (JSON Web Token) |
| Language | TypeScript |

---

## 📦 Getting Started (Local Setup)

Follow these steps to run the project on your local machine.

---

### 🧾 1️⃣ Prerequisites

Ensure you have the following installed:

- **Node.js** v18 or later → [Download](https://nodejs.org/)
- **npm** or **yarn**
- **PostgreSQL** database (local or cloud-based)

---

### 🧬 2️⃣ Clone the Repository

```bash
git https://github.com/MhideTech/Template-Service-Microservice
cd Template-Service-Microservice
```

---

### ⚙️ 3️⃣ Install Dependencies
```bash
npm install
```

---

### 🗃️ 4️⃣ Set Up PostgreSQL Database
You can create a local or remote PostgreSQL database.

Example using psql:
```sql
CREATE DATABASE template_service_db;
CREATE USER template_user WITH PASSWORD 'template_password';
GRANT ALL PRIVILEGES ON DATABASE template_service_db TO template_user;
```

---

### 🔑 5️⃣ Create .env File
In the root folder of the project, create a .env file:
```bash
touch .env
```
Then add the following:

```bash
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=template_user
DB_PASSWORD=template_password
DB_NAME=template_service_db

# JWT Secret Key
JWT_SECRET=your_jwt_secret_key_here

# Server Port
PORT=3000
```

---
### 🏗️ 6️⃣ Run the Application
```bash
npm run start:dev
```

Your server should now be running at:

👉 http://localhost:3000

---
## 🧠 API Endpoints

#### Below are all the major endpoints you can test via Postman or cURL.
---

### 🔐 Authentication Routes
### 🟢 Register

**POST** `/auth/register`

**Body (JSON):**
```json
{
  "username": "olamide",
  "password": "mypassword"
}
```
✅ Response:
```json
{
  "id": 1,
  "username": "olamide"
}
```
---
### 🟢 Login

**POST** `/auth/login`

**Body (JSON):**
```json
{
  "username": "olamide",
  "password": "mypassword"
}
```
✅ Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```
You’ll use this `access_token` for all other secured endpoints.

---
### 📄 Template Routes

All template routes are protected — you must include your JWT token in the headers.

**Required Header:**
```makefile
Authorization: Bearer <your_access_token>
```
---
### 🟢 Create Template

**POST** `/templates`

**Body (JSON):**
```json
{
  "title": "Welcome Template",
  "content": "Hello {{name | Guest}}, welcome to {{platform | our service}}!",
  "category": "email"
}
```
✅ Response:
```json
{
  "id": 1,
  "title": "Welcome Template",
  "content": "Hello {{name | Guest}}, welcome to {{platform | our service}}!",
  "category": "Email"
}
```
---
### 🟢 Get All Templates (with Pagination)

**GET** `/templates?page=1&limit=5`

✅ Response:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Welcome Template",
      "category": "Email"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 5
}
```
---
### 🟢 Get Template by ID

**GET** `/templates/1`

✅ Response:
```json
{
  "id": 1,
  "title": "Welcome Template",
  "content": "Hello {{name | Guest}}, welcome to {{platform | our service}}!",
  "category": "Email"
}
```
---
### 🟢 Preview a Template

**POST** `/templates/1/preview`

**Body (JSON):**
```json
{
  "variables": {
    "name": "Olamide",
    "platform": "TemplateFlow"
  }
}
```

✅ Response:
```json
{
  "renderedContent": "Hello Olamide, welcome to TemplateFlow!",
  "usedVariables": ["name", "platform"],
  "missingVariables": [],
  "availableVariables": ["name", "platform"]
}
```
If variables are missing:
```json
{
  "variables": {}
}
```
✅ Response:
```json
{
  "renderedContent": "Hello Guest, welcome to our service!",
  "usedVariables": [],
  "missingVariables": ["name", "platform"],
  "availableVariables": ["name", "platform"]
}
```
---
### 🟢 Update Template

**PUT** `/templates/1`

**Body (JSON):**
```json
{
  "content": "Hi {{name | Guest}}, welcome back to {{platform | TemplateFlow}}!"
}

```

✅ Response:
```json
{
  "id": 1,
  "title": "Welcome Template",
  "content": "Hi {{name | Guest}}, welcome back to {{platform | TemplateFlow}}!",
  "category": "Email"
}
```
---
### 🟢 Delete Template

**DELETE** `/templates/1`

✅ Response:
```json
{
  "message": "Template deleted successfully."
}
```
---
### ⚠️ Error Responses
| Error Type         | Example Message                       | Status |
| ------------------ | ------------------------------------- | ------ |
| Invalid category   | `category must be a valid enum value` | 400    |
| Template not found | `Template with ID 99 not found.`      | 400    |
| Missing JWT        | `Unauthorized`                        | 401    |
| Invalid login      | `Invalid credentials`                 | 401    |

---
### 📂 Project Structure
```cpp
src/
│
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── user.entity.ts
│
├── templates/
│   ├── dto/
│   ├── entities/
│   ├── templates.controller.ts
│   ├── templates.service.ts
│   ├── template-categories.enum.ts
│
├── app.module.ts
├── main.ts
```
---
### 🧪 Testing with Postman

1. Open Postman
2. Register a new user via /auth/register
3. Login and copy the access_token
4. Add the header Authorization: Bearer <token> to all template endpoints
5. Try each endpoint in order:
* Create
* Get all (paginated)
* Preview
* Update
* Delete
