import { Router } from "express";
import { register, authenticate, refreshAccessToken } from "../services/authServices.js";

export const authRoute = Router();

// Register
authRoute.post("/register", async (req, res, next) => {
  try {
    const user = await register(req.body);
    res.status(201).json({ message: "User created", payload: user });
  } catch (err) {
    next(err);
  }
});

// Login
authRoute.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authenticate(email, password);

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user,
    });
  } catch (err) {
    next(err);
  }
});

// Refresh token
authRoute.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    const newAccessToken = await refreshAccessToken(refreshToken);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
});

// Logout
authRoute.post("/logout", (req, res) => {
  res.clearCookie("refresh_token");
  res.sendStatus(204);
});