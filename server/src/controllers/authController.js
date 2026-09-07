const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const PUBLIC_REGISTRATION_ROLES = ["student"];

function createToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

function setAuthCookie(res, token) {
  const sameSite = process.env.NODE_ENV === "production" ? "None" : "Lax";
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `ayush_access_token=${token}; Max-Age=604800; Path=/; HttpOnly; SameSite=${sameSite}${secure}`,
  );
}

async function register(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ message: "name, email, password, and role are required" });
  }
  if (!PUBLIC_REGISTRATION_ROLES.includes(role)) {
    return res
      .status(403)
      .json({
        message:
          "Only student accounts can be created through public registration",
      });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must contain at least 8 characters" });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser)
    return res.status(409).json({ message: "Email is already registered" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email: normalizedEmail,
    passwordHash,
    role,
  });

  const token = createToken(user);
  setAuthCookie(res, token);
  return res.status(201).json({ user: publicUser(user), token });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "email and password are required" });

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+passwordHash",
  );
  const passwordMatches =
    user && (await bcrypt.compare(password, user.passwordHash));
  if (!passwordMatches)
    return res.status(401).json({ message: "Invalid email or password" });

  const token = createToken(user);
  setAuthCookie(res, token);
  return res.json({ user: publicUser(user), token });
}

function logout(req, res) {
  const sameSite = process.env.NODE_ENV === "production" ? "None" : "Lax";
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `ayush_access_token=; Max-Age=0; Path=/; HttpOnly; SameSite=${sameSite}${secure}`,
  );
  return res.status(204).send();
}

module.exports = { register, login, logout };
