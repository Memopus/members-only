const User = require("../models/users.model");
const Message = require("../models/messages.model");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.users_list = asyncHandler(async (req, res, next) => {
  const users = await User.find({});

  res.json(users);
});

exports.users_create_get = asyncHandler(async (req, res, next) => {
  res.render("user_create_form", { errors: undefined });
});

exports.users_login_get = asyncHandler(async (req, res, next) => {
  res.render("user_login_form");
});

exports.users_create_post = [
  body("firstName", "Length must be greater than 2")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("lastName", "Length must be greater than 5")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  body(
    "password",
    "Length must be greater than 6 and should contain at least one digit"
  )
    .trim()
    .isLength({ min: 6 })
    .escape()
    .matches(/\d/),

  body("email", "Must be an email ").isEmail(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("user_create_form", { errors: errors.array() });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        isAdmin: false,
        isMember : false,
      });

      await user.save();
      res.redirect("/");
    }
  }),
];

exports.users_joinClub_post = asyncHandler(async (req ,res ) => {
  if (req.body.secret === 'Secret') {
    const user = await User.findByIdAndUpdate(req.user._id , {isMember : true})
    await user.save()
    console.log('all good')
    res.redirect("/")
  } 
})

exports.users_joinClub_get = asyncHandler(async (req ,res ) => {
  res.render('joinClub.ejs')
})