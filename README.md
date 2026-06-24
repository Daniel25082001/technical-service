# 🛠 Technical Service API

Backend system for managing **clients** and **repair work orders**.

Built with:
- Node.js
- Express
- TypeScript
- MongoDB (Docker)
- Mongoose

---

## 📌 Project Description

This system allows:

- Client management (CRUD)
- Work order registration
- Tracking repair status
- Database persistence using MongoDB

---

## ⚙️ Requirements

Before running the project, make sure you have installed:

- Node.js
- Docker Desktop
- Git

---

## 🐳 Run MongoDB (Docker)

Start MongoDB container:

docker compose up -d

Stop MongoDB:

docker compose down

Check running containers:

docker ps

MongoDB will be available at:

mongodb://localhost:27017

---

## 📦 Install dependencies

npm install

---

## 🚀 Run the project

Development mode:

npm run dev

Server runs on:

http://localhost:3000

---

## 📁 Project structure

src/
├── client/
│   ├── client.model.ts
│   ├── client.repository.ts
│   ├── client.service.ts
│   ├── client.controller.ts
│   └── client.routes.ts
├── db/
│   └── mongo.ts
├── app.ts
└── init.ts

---

# 👤 CLIENT MODULE (CRUD)

Base URL:

http://localhost:3000/clients

---

## ➕ Create client

POST /clients

{
  "name": "John Doe",
  "phone": "123456789",
  "address": "Street 123"
}

---

## 📄 Get all clients

GET /clients

---

## 🔍 Get client by ID

GET /clients/:id

---

## ✏️ Update client

PUT /clients/:id

{
  "phone": "111222333"
}

---

## ❌ Delete client

DELETE /clients/:id

---

## 🧠 Business Rules

- Phone must be unique
- Required fields: name, phone, address
- API returns 404 if client not found
- Uses proper HTTP status codes

---

## 🛠 Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Docker

---

## 👨‍💻 Author

Academic backend project for learning purposes.
