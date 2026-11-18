
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import router from './src/router.js';
import swaggerSpec from './swagger.js';

const app = express();

// Parse JSON request bodies
app.use(express.json());

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Home route
app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Server is running'
  });
});

// API routes
app.use(router);

// Handle unknown routes
app.use((req, res) => {
  return res.status(404).json({
    error: 'Route not found'
  });
});

// Handle malformed JSON and unexpected errors
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: 'Invalid JSON request body'
    });
  }

  console.error('Unexpected server error:', error);

  return res.status(500).json({
    error: 'Internal server error'
  });
});

export default app;
