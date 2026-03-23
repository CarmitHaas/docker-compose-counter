const express = require('express');
const redis = require('redis');

const app = express();
const port = 3000;

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Connect to Redis using service name from docker-compose
const REDIS_HOST = process.env.REDIS_HOST || 'db';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`
});

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

// Connect to Redis
(async () => {
  await client.connect();

  // Initialize counter if it doesn't exist
  const existing = await client.get('pageviews');
  if (!existing) {
    await client.set('pageviews', '0');
    console.log('Counter initialized');
  }
})();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Get page views
app.get('/api/views', async (req, res) => {
  try {
    const views = await client.get('pageviews');
    res.json({ views: parseInt(views || '0') });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Increment page views
app.post('/api/views', async (req, res) => {
  try {
    const newViews = await client.incr('pageviews');
    res.json({ views: newViews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend API running on port ${port}`);
});
