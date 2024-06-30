const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authController = require("./controllers/authController");
const constructionController = require("./controllers/constructionController");
const requestController = require("./controllers/requestController");
const { authenticateToken } = require("./middleware/authMiddleware");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Auth routes
app.post("/api/register", authController.register);
app.post("/api/login", authController.login);
app.post("/api/token", authController.refreshToken);
app.post("/api/logout", authController.logout);

// Construction object routes
app.get("/api/constructionObjects", constructionController.getAll);
app.post(
  "/api/constructionObjects",
  authenticateToken,
  constructionController.create
);
app.put(
  "/api/constructionObjects/:id",
  authenticateToken,
  constructionController.update
);
app.delete(
  "/api/constructionObjects/:id",
  authenticateToken,
  constructionController.remove
);
app.get("/api/constructionObjects/:id", constructionController.getById);

// Request routes
app.get("/api/requests", requestController.getAll);
app.post("/api/requests", requestController.create);
app.put("/api/requests/:id", authenticateToken, requestController.update);
app.get("/api/requests/:id", requestController.getById);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
