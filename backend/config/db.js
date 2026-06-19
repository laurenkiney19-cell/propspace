const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/propspace';

/**
 * Connect to MongoDB with retry/backoff. Does not terminate the process on failure.
 * This makes development with nodemon more resilient when MongoDB starts slower than the app.
 */
const connectDB = async (options = {}) => {
  const retries = options.retries ?? 5;
  const delayMs = options.delayMs ?? 2000;

  mongoose.set('strictQuery', false);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log(`MongoDB connected: ${mongoose.connection.host}`);
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt} failed: ${err.message}`);
      if (attempt < retries) {
        const backoff = delayMs * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${backoff}ms...`);
        await new Promise((r) => setTimeout(r, backoff));
        continue;
      }
      console.error('MongoDB connection failed after retries. Continuing without DB.');
      return;
    }
  }
};

module.exports = connectDB;
