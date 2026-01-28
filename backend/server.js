const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock Database (Replace with real DB later)
const users = [];

// Signup Route
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);

    console.log("User registered:", newUser);
    res.status(201).json({ message: "User created successfully", user: { name, email } });
});

// Login Route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.json({ message: "Login successful", token: "fake-jwt-token-123", user: { name: user.name, email: user.email } });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});