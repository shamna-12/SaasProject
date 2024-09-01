
require('dotenv').config();


const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mySaasApp'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

const JWT_SECRET = '6PH06oxWqoZiH6eMQb8bTmfIoV8fh0aeHiV/uNqMGrA='; 

app.post('/api/users/register', async (req, res) => {
  const { name, email, password, company } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      if (results.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query('INSERT INTO users (name, email, password_hash, company) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, company], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      const user = results[0];

      if (!user || !await bcrypt.compare(password, user.password_hash)) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users/profile', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    db.query('SELECT id, name, email, company FROM users WHERE id = ?', [decoded.id], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      const user = results[0];

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
