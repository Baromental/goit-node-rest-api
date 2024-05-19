import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";
import { emailRegexp } from "../constants/user-constants.js";

const userSchema = new Schema({
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token:{ 
      type: String
    },
    avatarURL: {
      type: String,
    },
  }, {versionKey: false, timestamps:true});

userSchema.pre("findOneAndUpdate", setUpdateSetting);

userSchema.post("save", handleSaveError );

userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;