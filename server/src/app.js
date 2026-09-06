const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const taxonomyRoutes = require('./routes/taxonomyRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const profileRoutes = require('./routes/profileRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({ name: 'AYUSH Skill Mapping API', status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ayush-platform-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/taxonomy', taxonomyRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/profile', profileRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;