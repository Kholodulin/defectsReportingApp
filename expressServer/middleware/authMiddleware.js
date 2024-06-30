const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../controllers/authController");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    console.log("No token provided");
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      if (err.name === "TokenExpiredError") {
        return res.sendStatus(401); // Возвращаем 401 при истечении срока действия токена
      }
      return res.sendStatus(403); // Возвращаем 403 для других ошибок
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
