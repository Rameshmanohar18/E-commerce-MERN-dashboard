# Setting Up a Backend Server in MERN Stack

Here's a complete step-by-step guide to set up a backend server using Node.js, Express, and MongoDB:

## Step 1: Initialize the Project

```bash
# Create project directory
mkdir mern-backend
cd mern-backend

# Initialize package.json
npm init -y
```

## Step 2: Install Dependencies

```bash
# Core dependencies
npm install express mongoose cors dotenv

# Development dependencies
npm install -D nodemon
```

## Step 3: Create Basic Project Structure

```
mern-backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── controllers/
│   │   └── userController.js
│   ├── middleware/
│   │   └── errorMiddleware.js
│   └── server.js
├── .env
├── .gitignore
└── package.json
```

## Step 4: Set Up Express Server

**src/server.js**

```javascript
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to MERN Backend API" });
});

// Define routes
app.use("/api/users", require("./routes/userRoutes"));

// Error handling middleware
app.use(require("./middleware/errorMiddleware"));

// Server configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Step 5: Configure Database Connection

**src/config/db.js**

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## Step 6: Create a Mongoose Model

**src/models/User.js**

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
```

## Step 7: Create Controllers

**src/controllers/userController.js**

```javascript
const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
```

## Step 8: Create Routes

**src/routes/userRoutes.js**

```javascript
const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
```

## Step 9: Create Error Middleware

**src/middleware/errorMiddleware.js**

```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
```

## Step 10: Configure Environment Variables

**.env**

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_database
```

## Step 11: Update package.json Scripts

**package.json**

```json
{
  "name": "mern-backend",
  "version": "1.0.0",
  "description": "",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "mongoose": "^7.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

## Step 12: Create .gitignore

**.gitignore**

```
node_modules/
.env
npm-debug.log
.DS_Store
```

## Step 13: Run the Server

```bash
# Start MongoDB (make sure MongoDB is installed and running)
# For macOS:
brew services start mongodb-community

# For Windows (run as administrator):
net start MongoDB

# For Ubuntu:
sudo systemctl start mongod

# Start the backend server in development mode
npm run dev
```

## Step 14: Test the API

Use Postman or curl to test:

```bash
# Get all users
curl http://localhost:5000/api/users

# Create a new user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Get single user
curl http://localhost:5000/api/users/{user_id}
```

## Additional Features to Consider Adding:

1. **Authentication (JWT)**

```bash
npm install bcryptjs jsonwebtoken
```

2. **Validation**

```bash
npm install express-validator
```

3. **File Uploads**

```bash
npm install multer
```

4. **Security**

```bash
npm install helmet express-rate-limit
```

5. **Logging**

```bash
npm install morgan
```

## Production Deployment Checklist:

1. Set `NODE_ENV=production` in environment
2. Use a process manager like PM2
3. Configure CORS properly for your frontend domain
4. Implement proper error handling
5. Add request validation
6. Set up logging
7. Use environment variables for all sensitive data
8. Implement rate limiting
9. Add security headers
10. Set up database backups

Your backend server is now ready! You can connect your React frontend to this backend by making API calls to `http://localhost:5000/api`.
