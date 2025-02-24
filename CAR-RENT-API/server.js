const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const { getDb } = require("./rent");

const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key";

app.use(bodyParser.json());

// Middleware for authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Register user
app.post("/register", async (req, res) => {
  const { fullName, email, username, password } = req.body;
  if (!fullName || !email || !username || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  const db = getDb();
  const usersCollection = db.collection("users");
  const existingUser = await usersCollection.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists." });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await usersCollection.insertOne({
    fullName,
    email,
    username,
    password: hashedPassword,
  });
  res.status(201).json({ message: "User registered successfully." });
});

// Login user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const db = getDb();
  const usersCollection = db.collection("users");
  const user = await usersCollection.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials." });
  }
  const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY);
  res.json({ token });
});

// Get user profile (authenticated)
app.get("/my-profile", authenticateToken, async (req, res) => {
  const db = getDb();
  const usersCollection = db.collection("users");
  const user = await usersCollection.findOne(
    { _id: new ObjectId(req.user.id) },
    { projection: { password: 0 } }
  );
  res.json(user);
});

app.post("/add-car", authenticateToken, async (req, res) => {
  try {
    const { name, year, color, price_per_day, steering_type, number_of_seats } =
      req.body;

    if (
      !name ||
      !year ||
      !color ||
      !price_per_day ||
      !steering_type ||
      !number_of_seats
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const db = getDb();
    const carsCollection = db.collection("cars");

    const newCar = {
      name,
      year: parseInt(year),
      color,
      price_per_day: parseFloat(price_per_day),
      steering_type,
      number_of_seats: parseInt(number_of_seats),
    };

    const result = await carsCollection.insertOne(newCar);

    res
      .status(201)
      .json({
        message: "The car was added successfully.",
        carId: result.insertedId,
      });
  } catch (err) {
    console.error("Error adding car:", err);
    res.status(500).json({ message: "Error adding car." });
  }
});

// Get available rental cars with filters
app.get("/rental-cars", async (req, res) => {
  const { year, color, steering_type, number_of_seats } = req.query;
  const db = getDb();
  const carsCollection = db.collection("cars");

  // Filter query
  const query = {};
  if (year) query.year = parseInt(year);
  if (color) query.color = color;
  if (steering_type) query.steering_type = steering_type;
  if (number_of_seats) query.number_of_seats = parseInt(number_of_seats);

  const cars = await carsCollection
    .find(query)
    .sort({ price_per_day: 1 })
    .toArray();

  res.json(cars);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
