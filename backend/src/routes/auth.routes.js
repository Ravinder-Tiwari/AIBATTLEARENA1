import {Router} from "express"
import passport from "passport";
import { registerUser, loginUser, googleCallback, getMe,logoutUser } from "../controllers/auth.controller.js"
import { authUser } from "../middleware/auth.middleware.js";




const authRouter = Router()

authRouter.post("/register", registerUser)
authRouter.post("/login",authUser, loginUser)

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  googleCallback
);

authRouter.get("/getMe",authUser,getMe)
authRouter.post("/logout", authUser, logoutUser)

export default authRouter