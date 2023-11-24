const express = require("express");
const usersControllers = require("../controllers/users.controllers");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const bcrypt = require("bcryptjs");
const User = require("../models/users.model");

router.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        console.log("test");
        const user = await User.findOne({ email: email });
        if (!user) {
          console.log("user not existe");
          return done(null, false, { message: "Incorrect Email" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          console.log("didnot match");
          return done(null, false, { message: "Incorrect Password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

router.get("/register", usersControllers.users_create_get);
router.get("/login", usersControllers.users_login_get);
router.post("/register", usersControllers.users_create_post);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/",
  })
);

module.exports = router;
