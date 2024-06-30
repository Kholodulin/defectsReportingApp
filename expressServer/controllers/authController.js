const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users } = require("../models");

const generateAccessToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
};

const register = async (req, res) => {
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
};

const login = async (req, res) => {
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
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    accessToken,
    message: "Login successful",
  });
};

const refreshToken = (req, res) => {
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

const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(204).send();
};

module.exports = { register, login, refreshToken, logout, JWT_SECRET };
