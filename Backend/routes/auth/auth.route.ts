import { Router } from "express";
import passport from "passport";
import { callback, getMe } from "../../controllers/AuthController/auth.controller.ts";
import '../../config/passport.config.ts'
import { protectRoute } from "../../middlewares/auth.middlewares.ts";

const authRoute = Router();

authRoute.get('/google',
  passport.authenticate("google", { scope: ["profile", "email"] })
)

authRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  callback
);

authRoute.get('/getMe', protectRoute, getMe)

// authRoute.get('/logout', protectRoute, logOut)

export default authRoute;