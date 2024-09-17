const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("express-async-errors"); // Ensures async errors are properly caught

const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/songs");
const playListRoutes = require("./routes/playLists");
const searchRoutes = require("./routes/search");

const app = express();

// Database connection
connection();

// Middleware
app.use(cors());
app.use(express.json());

// Route handlers
app.use("/api/users", userRoutes);
app.use("/api/login", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playListRoutes);
app.use("/api", searchRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
