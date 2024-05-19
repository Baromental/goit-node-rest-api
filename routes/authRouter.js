import express from "express"
import authControllers  from "../controllers/authControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import { userSignUpSchema, userSignInSchema, userEmailSchema } from "../schemas/authSchemas.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js"
import upload from "../middlewares/upload.js";


const authRouter = express.Router()

authRouter.post("/register", isEmptyBody, validateBody(userSignUpSchema), authControllers.signUp)

authRouter.get("/verify/:verificationToken", authControllers.verify);

authRouter.post("/verify", isEmptyBody, validateBody(userEmailSchema), authControllers.resendEmail)

authRouter.post("/login", isEmptyBody, validateBody(userSignInSchema), authControllers.signIn)

authRouter.get("/current", authenticate, authControllers.getCurrent)

authRouter.post("/logout", authenticate, authControllers.signOut)

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authControllers.updateAvatar);

export default authRouter;