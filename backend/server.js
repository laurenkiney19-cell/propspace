const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const propertyRoutes = require('./routes/property.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const port = process.env.PORT || 5000;

// Start DB connection (with retry/backoff). Don't block server start.
connectDB();

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');

app.use(helmet());
app.use(mongoSanitize());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);

app.get('/api', (req, res) => res.json({ status: 'ok', message: 'PropSpace API is running.' }));

// Health endpoint to check server and DB status
app.get('/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting', 'unauthorized'];
  const dbState = mongoose?.connection?.readyState ?? 0;
  res.json({
    status: 'ok',
    db: states[dbState] ?? `unknown(${dbState})`,
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'development',
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  const isProd = process.env.NODE_ENV === 'production';
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: { message: err.message, details: err.errors } });
  }
  if (err.name === 'MulterError' || err instanceof SyntaxError) {
    return res.status(400).json({ error: { message: err.message } });
  }
  const payload = { message: isProd ? 'Internal server error.' : err.message };
  if (!isProd) payload.stack = err.stack;
  return res.status(500).json({ error: payload });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
