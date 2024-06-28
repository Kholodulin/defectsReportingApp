const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

let constructionObjects = [
  {
    id: "1",
    name: "Building A",
    address: "123 Main St",
    registrationDate: "2023-01-01T00:00:00.000Z",
    requestsCount: 2,
  },
  {
    id: "2",
    name: "Building B",
    address: "456 Elm St",
    registrationDate: "2023-02-01T00:00:00.000Z",
    requestsCount: 1,
  },
  {
    id: "3",
    name: "Building A2",
    address: "123 Main St",
    registrationDate: "2023-01-01T00:00:00.000Z",
    requestsCount: 2,
  },
  {
    id: "4",
    name: "Building B copy",
    address: "456 Elm St",
    registrationDate: "2023-02-01T00:00:00.000Z",
    requestsCount: 1,
  },
];

let requests = [
  {
    id: "1",
    title: "Fix Roof Leak",
    description: "Tiles in building A are cracked.",
    email: "user1@example.com",
    submissionDate: "2024-01-01T12:00:00.000Z",
    status: "Completed",
    objectId: 1,
  },
  {
    id: "2",
    title: "Repair Window",
    description: "A window in Building A is broken",
    email: "user2@example.com",
    submissionDate: "2024-01-02T12:00:00.000Z",
    status: "Pending",
    objectId: 1,
  },
  {
    id: "3",
    title: "Paint Wall",
    description: "The wall in Building B needs painting",
    email: "user3@example.com",
    submissionDate: "2024-01-03T12:00:00.000Z",
    status: "Pending",
    objectId: 2,
  },
  {
    id: "4",
    title: "Fix Roof Leak (Copy)",
    description: "Tiles in building A are cracked.",
    email: "user1@example.com",
    submissionDate: "2024-01-01T12:00:00.000Z",
    status: "Pending",
    objectId: 1,
  },
  {
    id: "5",
    title: "Repair Window (Copy)",
    description: "A window in Building A is broken",
    email: "user2@example.com",
    submissionDate: "2024-01-02T12:00:00.000Z",
    status: "Pending",
    objectId: 1,
  },
  {
    id: "6",
    title: "Paint Wall (Copy)",
    description: "The wall in Building B needs painting",
    email: "user3@example.com",
    submissionDate: "2024-01-03T12:00:00.000Z",
    status: "Pending",
    objectId: 2,
  },
];

let users = [
  {
    email: "mail@mail.ru",
    password: "$2a$10$8A7mg5qBHn2H5uo2GFthF.s1RGnThxRqXVEpJii8rHAZl1wwlW80C",
    fullName: "name",
    id: 1,
    role: "Manager",
  },
  {
    email: "m@m.ru",
    password: "$2a$10$adDUGpH6WBgCgPb5Vk4yvuNh6eGhb3fv8U99jg2Rquxb14UMwKVWW",
    fullName: "testName",
    role: "User",
    id: 2,
  },
];

const generateAccessToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "2m" });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
};

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Проверка типа ошибки
      if (err.name === "TokenExpiredError") {
        return res.sendStatus(401); // Возвращаем 401 при истечении срока действия токена
      }
      return res.sendStatus(403); // Возвращаем 403 для других ошибок
    }
    req.user = user;
    next();
  });
};

// Middleware для обновления токена
const refreshToken = (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({
      email: user.email,
      role: user.role,
    });
    res.json({ accessToken });
  });
};

// Регистрация пользователя
app.post("/api/register", async (req, res) => {
  const { email, password, fullName, role } = req.body;
  const userExists = users.find((user) => user.email === email);

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    fullName,
    role,
  };
  users.push(newUser);
  res.status(201).json({ message: "User registered" });
});

// Авторизация пользователя
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => user.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken({
    email: user.email,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    email: user.email,
    role: user.role,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
  });
  res.status(200).json({
    accessToken,
    message: "Login successful",
  });
});

// Обновление accessToken
app.post("/api/token", refreshToken);

// Выход пользователя (удаление refreshToken)
app.post("/api/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.status(204).send();
});

// CRUD операции для constructionObjects и requests
app.get("/api/constructionObjects", (req, res) => {
  res.json(constructionObjects);
});

app.post("/api/constructionObjects", authenticateToken, (req, res) => {
  const newObject = {
    ...req.body,
    id: (constructionObjects.length + 1).toString(),
  };
  constructionObjects.push(newObject);
  res.status(201).json({ message: "Construction object added" });
});

app.delete("/api/constructionObjects/:id", authenticateToken, (req, res) => {
  const objectId = req.params.id;
  constructionObjects = constructionObjects.filter(
    (obj) => obj.id !== objectId
  );
  res.status(200).json({ message: "Construction object deleted" });
});

app.put("/api/constructionObjects/:id", authenticateToken, (req, res) => {
  const objectId = req.params.id;
  const updatedObject = { ...req.body, id: objectId };
  constructionObjects = constructionObjects.map((obj) =>
    obj.id === objectId ? updatedObject : obj
  );
  res.status(200).json({ message: "Construction object updated" });
});

app.get("/api/constructionObjects/:id", (req, res) => {
  const objectId = req.params.id;
  const object = constructionObjects.find((obj) => obj.id === objectId);
  if (object) {
    res.json(object);
  } else {
    res.status(404).json({ message: "Construction object not found" });
  }
});

app.get("/api/requests", (req, res) => {
  res.json(requests);
});

app.post("/api/requests", (req, res) => {
  const newRequest = { ...req.body, id: (requests.length + 1).toString() };
  requests.push(newRequest);
  res.status(201).json({ message: "Request added" });
});

app.put("/api/requests/:id", authenticateToken, (req, res) => {
  const requestId = req.params.id;
  const updatedRequest = { ...req.body, id: requestId };
  requests = requests.map((req) =>
    req.id === requestId ? updatedRequest : req
  );
  res.status(200).json({ message: "Request updated" });
});

app.get("/api/requests/:id", (req, res) => {
  const requestId = req.params.id;
  const request = requests.find((req) => {
    req.id === requestId;
  });
  if (request) {
    res.json(request);
  } else {
    res.status(404).json({ message: "Request not found" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
