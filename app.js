const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key-here'; // In production, use environment variables

// Middleware
app.use(bodyParser.json());

// In-memory user database (hardcoded for this exercise)
const users = {
  admin: 'password123'
};

// In-memory account balance
let balance = 1000;

// JWT verification middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
};

// Login endpoint - generates JWT token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate credentials
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (users[username] !== password) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  // Generate JWT token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Protected route: Get account balance
app.get('/balance', authenticateToken, (req, res) => {
  res.json({ balance });
});

// Protected route: Deposit money
app.post('/deposit', authenticateToken, (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount. Must be greater than 0.' });
  }

  balance += amount;
  res.json({
    message: 'Deposited successfully',
    newBalance: balance
  });
});

// Protected route: Withdraw money
app.post('/withdraw', authenticateToken, (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount. Must be greater than 0.' });
  }

  if (amount > balance) {
    return res.status(400).json({ error: 'Insufficient balance.' });
  }

  balance -= amount;
  res.json({
    message: 'Withdrawn successfully',
    newBalance: balance
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
