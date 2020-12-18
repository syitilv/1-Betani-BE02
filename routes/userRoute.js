const router = require("express").Router();
// Bring in the User Registration function
const {
  userAuth,
  userLogin,
  userRegister,
  serializeUser
} = require("../utils/Auth");

// Registeration Route
router.post("/register", async (req, res) => {
  await userRegister(req.body, res);
});

// Login Route
router.post("/login", async (req, res) => {
  await userLogin(req.body, res);
});


// Profile Route
router.get("/profile", userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});


module.exports = router;
