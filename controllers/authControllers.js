import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js"
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import  jwt from "jsonwebtoken";

const {JWT_SECRET} = process.env;

const signUp = async(req, res)=> {
    const {email} = req.body;
    const user = await authServices.findUser({email});
    if(user) {
        throw HttpError(409, "Email in use")
    }
    const newUser = await authServices.signUp(req.body);

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

export default {
    signUp: ctrlWrapper(signUp),
    signIn: ctrlWrapper(signIn),
    getCurrent: ctrlWrapper(getCurrent),
    signOut: ctrlWrapper(signOut),
};