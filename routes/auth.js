const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, userID, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ userID });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const user = new User({ name, userID, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error); // Log the error
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { userID, password } = req.body;
  
  try {
    // Find the user by userID
    const user = await User.findOne({ userID });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    // Prepare the user object for the response
    const userData = {
      id: user._id,
      name: user.name,
      userID: user.userID,
    };

    // Add the role only if it exists in the database
    if (user.role) {
      userData.role = user.role;
    }

    // Send the response with token and user data
    res.json({
      token,
      user: userData
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Middleware to verify admin role
const adminAuth = (req, res, next) => {
  const { user } = req;

  if (user && user.role === "admin") {
    next(); // User is admin, proceed to the next middleware/route handler
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

// JWT Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};


router.put("/update-user/:id", authMiddleware, adminAuth, async (req, res) => {
  const { id } = req.params;
  const { role, password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Update role if provided
    if (role) {
      user.role = role;
      console.log("Updated role:", role);
    }

    // Save password directly without hashing (For testing purposes only)
    if (password) {
      user.password = password;
      console.log("Updated Password without hash");
    }

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Delete a user (Admins Only)
router.delete("/users/:id", authMiddleware, adminAuth, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Fetch All Users Route (Admins Only)
router.get("/users", authMiddleware, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password field
    res.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
