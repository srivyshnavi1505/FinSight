import { Schema, model } from "mongoose";


const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required :[true,"password is required"],
      // Not required if using social login
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
    roles: {
      type: [String],
      enum: ["user", "annotator", "admin"],
      default: ["user"],
      required: [true, "At least one role is required"],
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