import express from "express"
import authControllers  from "../controllers/authControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import { userSignUpSchema, userSignInSchema } from "../schemas/authSchemas.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js"

const authRouter = express.Router()

authRouter.post("/register", isEmptyBody, validateBody(userSignUpSchema), authControllers.signUp)

authRouter.post("/login", isEmptyBody, validateBody(userSignInSchema), authControllers.signIn)

authRouter.get("/current", authenticate, authControllers.getCurrent)

authRouter.post("/logout", authenticate, authControllers.signOut)

export default authRouter;