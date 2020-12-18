const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
// const mongoose = require('mongoose');
// const User = mongoose.models('user');
// const Buyers = mongoose.models('Buyers', buyerSchema);
// const Farmers = mongoose.models('Farmers');
// const Admin = mongoose.models('Admin');
// const Couriers = mongoose.models('Couriers');
const User = require("../models/users");
const Buyers = require("../models/Buyers");
const Farmers = require("../models/Farmers");
const Couriers = require("../models/Couriers");
const Admin = require("../models/Admin");
const { SECRET } = require("../config");

/**
 * @DESC To register the user (ADMIN, BUYER, FARMER, COURIER)
 */
const userRegister = async (userDets, res) => {
  try {
    // Validate the username
    let usernameNotTaken = await validateUsername(userDets.username);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: `Username is already taken.`,
        success: false
      });
    }

    // validate the email
    let emailNotRegistered = await validateEmail(userDets.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: `Email is already registered.`,
        success: false
      });
    }

    // Get the hashed password
    const password = await bcrypt.hash(userDets.password, 12);
    
    // create a new user
    const newUser = new User({
      ...userDets,
      password
    });

    await newUser.save(); //save
    
    if(newUser.role == 'buyer'){ 
        const newBuyer = new Buyers({
          id_user : newUser._id
        });
        newBuyer.save();
    }else if(newUser.role == 'farmer'){
      const newFarmer = new Farmers({
        id_user : newUser._id
      });
      newFarmer.save();
    }else if(newUser.role == 'courier'){
      const newCourier = new Couriers({
        id_user : newUser._id
      });
      newCourier.save();
    }else if(newUser.role == 'admin'){
      const newAdmin = new Admin({
        id_user : newUser._id
      });
      newAdmin.save();
    }

    return res.status(201).json({
      message: "Berhasil register.",
      success: true
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to create your account.",
      success: false
    });
  }
};

/**
 * @DESC To Login the user (ADMIN, BUYER, FARMER, COURIER)
 */
const userLogin = async (userCreds, res) => {
  let { username, password } = userCreds;
  // First Check if the username is in the database
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      message: "Username is not found. Invalid login credentials.",
      success: false
    });
  }
  
  // We will check the role
  // if (user.role !== role) {
  //   return res.status(403).json({
  //     message: "Please make sure you are logging in from the right portal.",
  //     success: false
  //   });
  // }
  // That means user is existing and trying to signin fro the right portal
  // Now check for the password
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // Sign in the token and issue it to the user
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        username: user.username,
        email: user.email
      },
      SECRET,
      { expiresIn: "7 days" }
    );

    let result = {
      username: user.username,
      role: user.role,
      email: user.email,
      token: `Bearer ${token}`,
      expiresIn: 168
    };

    return res.status(200).json({
      ...result,
      message: "Hurray! You are now logged in.",
      success: true
    });
  } else {
    return res.status(403).json({
      message: "Incorrect password.",
      success: false
    });
  }
};

const validateUsername = async username => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

/**
 * @DESC Passport middleware
 */
const userAuth = passport.authenticate("jwt", { session: false });

/**
 * @DESC Check Role Middleware
 */
const checkRole = roles => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();

const validateEmail = async email => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

const serializeUser = user => {
  return {
    username: user.username,
    email: user.email,
    _id: user._id,
    role: user.role,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt
  };
};


module.exports = {
  userAuth,
  checkRole,
  userLogin,
  userRegister,
  serializeUser
  // loggedIn,
  // adminOnly
};
