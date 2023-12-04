const express = require("express");
const usersControllers = require("../controllers/users.controllers");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const bcrypt = require("bcryptjs");
const User = require("../models/users.model");
const messagesController = require("../controllers/messages.controller");

router.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "Incorrect Email" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
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
    failureRedirect: "/user/login",
    successRedirect: "/",
  }) 
  );
  
router.post('/logout' , (req ,res) => {
  req.logOut((err) => {
    if(err) {
      return next(err)
    }
    res.redirect("/")
  })
})



const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/user/login'); // Redirect to login if not authenticated
};

router.get("/joinClub" , isAuthenticated , usersControllers.users_joinClub_get )
router.post("/joinClub" , isAuthenticated , usersControllers.users_joinClub_post )
  // messages 
  


router.get('/newMessage', isAuthenticated,messagesController.message_create_get);
router.post('/newMessage' , isAuthenticated , messagesController.message_create_post)



module.exports = router;
