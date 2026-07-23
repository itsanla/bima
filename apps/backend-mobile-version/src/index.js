require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const migrate = require('./db/migrate');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/error-handler');

const releasesRouter = require('./routes/releases');
const appRouter = require('./routes/app');

// Run migrations on startup
migrate();

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/v1/releases', releasesRouter);
app.use('/api/v1/app', appRouter);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handler (must be the last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
