import express from "express";
import cookieParser from "cookie-parser";

import { UserModel } from "./Models/UserModel.js";
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("Fincheck API is running...");
});




app.get("/create-user", async (req, res) => {
  const user = await UserModel.create({
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    passwordHash: "dummy123"
  });

  res.json(user);
});

export default app;
