import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js"
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import  jwt from "jsonwebtoken";
import fs from "fs/promises"
import path from "path"
import gravatar from "gravatar";
import { resizeImg } from "../helpers/resizeImg.js";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

const avatarsPath = path.resolve("public", "avatars")

const {JWT_SECRET} = process.env;

const signUp = async(req, res)=> {
    const {email} = req.body;
    const user = await authServices.findUser({email});
    if(user) {
        throw HttpError(409, "Email in use")
    }
    const avatarURL = gravatar.url(email, { protocol: "https", s: "100" });
    const verificationToken = nanoid();
    const newUser = await authServices.signUp({ email, password, avatarURL, verificationToken });
    const verificationEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to verify email</a>`
    }

    await sendEmail(verificationEmail);


    res.status(201).json({
        username: newUser.username,
        email: newUser.email,
    })
};

const verify = async(req, res) =>{
    const {verificationToken} = req.params;
    const user = await authServices.findUser({verificationToken});
    if(!user){
        throw HttpError(404, "User not found")
    }
    await authServices.updateUser({_id: user._id}, {verify: true, verificationToken: ""});

    res.json({
        message: "Verification successful"
    })
};

const resendEmail = async(req, res)=> {
    const {email} = req.body;
    const user = await authServices.findUser({email});
    if(!user){
        throw HttpError(404,"User not found")
    }
    if(user.verify){
        throw HttpError(400, "Verification has already been passed")
    }
    const verificationEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click to verify email</a>`
    }

    await sendEmail(verificationEmail);

    res.json({
        message: "Verification email sent",
    });
}

const signIn = async(req, res)=> {
    const {email, password} = req.body;
    const user = await authServices.findUser({email});
    if(!user){
        throw HttpError(401,"Email or password is wrong")
    }
    if (!user.verify) {
        throw HttpError(401, "Email not verify");
      }
    const passwordCompare = await authServices.comparePassword(password, user.password)
    if(!passwordCompare){
        throw HttpError(401, "Email or password is wrong")
    }

    const {_id: id} = user;

    const payload = {id};

    const token = jwt.sign(payload,JWT_SECRET, {expiresIn: "23h"});
    await authServices.updateUser({_id: id}, {token}); 

    res.json({
        token,
    })
}

const getCurrent = async(req, res)=> {
    const {email, subscription} = req.user;

    res.json({
        email,
        subscription,
    })
}

const signOut = async(req, res)=> {
    const {_id} = req.user;
    await authServices.updateUser({_id: id}, {token: ""});

    res.status(204).json();
}

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsPath, filename);
    await resizeImg(oldPath, newPath);
    await fs.unlink(oldPath);
    const avatar = path.join("avatars", filename);
    await authServices.updateUser({ _id }, { avatarURL: avatar });
    res.json({ avatarURL: avatar });
  };

export default {
    verify: ctrlWrapper(verify),
    resendEmail: ctrlWrapper(resendEmail),
    signUp: ctrlWrapper(signUp),
    signIn: ctrlWrapper(signIn),
    getCurrent: ctrlWrapper(getCurrent),
    signOut: ctrlWrapper(signOut),
    updateAvatar: ctrlWrapper(updateAvatar),
};
