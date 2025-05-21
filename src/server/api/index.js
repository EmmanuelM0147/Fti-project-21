import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { contactRouter } from '../routes/contact.js';
import { partnershipRouter } from '../routes/partnership.js';
import { giveRouter } from '../routes/give.js';
import { apiLimiter } from '../middleware/rateLimit.js';
import { logRequest, logError } from '../middleware/logger.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.API_PORT || 3001;

// Security middleware
app.use(helmet());

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://foliotechinstitute.com', 'https://www.foliotechinstitute.com'] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Global rate limiting
app.use(apiLimiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(logRequest);

// Routes
app.use('/api/contact', contactRouter);
app.use('/api/partnership', partnershipRouter);
app.use('/api/give', giveRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(logError);
app.use((err, req, res, next) => {
  res.status(500).json({ 
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});