import { UserModel } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id, roles: user.roles },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { sub: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

export const register = async (userData) => {
  const { firstName, lastName, email, password, role = "user" } = userData;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedpwd=await bcrypt.hash(password, 10);

  const user = new UserModel({
    firstName,
    lastName,
    email,
    passwordHash: hashedpwd, // hashed pwd using bcrypt
    roles: [role],
  });

  await user.save();
  return user.toJSON();
};

export const authenticate = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new Error("Invalid credentials");

  if (!user.isActive) throw new Error("Account is deactivated");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken, user: user.toJSON() };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error("No refresh token");

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await UserModel.findById(decoded.sub);
  if (!user || !user.isActive) throw new Error("Invalid refresh token");

  const newAccessToken = generateAccessToken(user);
  return newAccessToken;
};