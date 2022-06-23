const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const router = express.Router();
const JWT_SECRET = "Warrior";

// ROUTE 1 :  Create a User Using : POST "/api/auth/createuser" : No login required
router.post(
  "/createuser",
  [
    body("email", "Enter a valid Email Address").isEmail(),
    body("name", "Enter a valid Name").isLength({ min: 3, max: 20 }),
    body("password", "Enter a valid Password").isLength({ min: 8, max: 20 }),
  ],
  async (req, res) => {
    // if there are errors return Bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success : false, errors: errors.array() });
    }

    try {
      // Check wheather the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user != null) {
        return res.status(400).json({success : false, error: "User Already Exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        email: req.body.email,
        name: req.body.name,
        password: securePassword,
      });

      // res.json(user);
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({success : true, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({success : false, error : "Internal server error"});
    }
  }
);

// ROUTE 2 : Authenticate a User using : POST "/api/auth/login" : No login required

router.post(
  "/login",
  [
    body("email", "Enter a valid Email Address").isEmail(),
    // body('password', 'Enter a valid Password').isLength({min : 8, max : 20}),
    body("password", "Password Cannot be blank").exists(),
  ],
  async (req, res) => {
    // if there are errors return Bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success : false, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: email });
      if (user == null) {
        return res
          .status(400)
          .json({success : false, error: "Please enter correct Credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({success : false, error: "Please enter correct Credentials" });
      }

      const payLoad = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(payLoad, JWT_SECRET);
      const success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({success : false, error : "Internal server error"});
    }
  }
);

// ROUTE 3 : Get loggedIn User Details using : POST "/api/auth/getuser" : Login required

router.post("/getuser", fetchuser,  async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send({success : false, user});
    } catch (error) {
      console.error(error.message);
      res.status(500).send({success : false, error : "Internal server error"});
    }
  }
);

module.exports = router;
