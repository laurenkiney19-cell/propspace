const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const propertyRoutes = require('./routes/property.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);

app.get('/api', (req, res) => res.json({ status: 'ok', message: 'PropSpace API is running.' }));

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message, errors: err.errors });
  }
  if (err.name === 'MulterError' || err instanceof SyntaxError) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: err.message || 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
