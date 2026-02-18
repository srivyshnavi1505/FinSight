import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Used ONLY for local (email/password) login
    passwordHash: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },

    // Used ONLY for Google login
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple nulls
    },

    // Defines how the user authenticated
    authProvider: {
      type: String,
      enum: ["local", "google"],
      required: true,
      default: "local",
    },

    role: {
      type: [String],
      enum: ["user", "annotator", "admin"],
      default: ["user"],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    versionKey: false,
  }
);

export const UserModel = model("User", UserSchema);
