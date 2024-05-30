import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js"
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import  jwt from "jsonwebtoken";
import fs from "fs/promises"
import path from "path"
import gravatar from "gravatar";
import { resizeImg } from "../helpers/resizeImg.js";

const avatarsPath = path.resolve("public", "avatars")

const {JWT_SECRET} = process.env;

const signUp = async(req, res)=> {
    const {email} = req.body;
    const user = await authServices.findUser({email});
    if(user) {
        throw HttpError(409, "Email in use")
    }
    const avatarURL = gravatar.url(email, { protocol: "https", s: "100" });
    const newUser = await authServices.signUp({...req.body, avatarURL });

    res.status(201).json({
        username: newUser.username,
        email: newUser.email,
    })
};

const signIn = async(req, res)=> {
    const {email, password} = req.body;
    const user = await authServices.findUser({email});
    if(!user){
        throw HttpError(401,"Email or password is wrong")
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
    signUp: ctrlWrapper(signUp),
    signIn: ctrlWrapper(signIn),
    getCurrent: ctrlWrapper(getCurrent),
    signOut: ctrlWrapper(signOut),
    updateAvatar: ctrlWrapper(updateAvatar),
};
