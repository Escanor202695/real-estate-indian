const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Load env vars from the server's .env file
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const properties = require('./routes/properties');
const cities = require('./routes/cities');
const users = require('./routes/users');
const admin = require('./routes/admin');
const email = require('./routes/email');
const bugReports = require('./routes/bugReports');

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ClickProp API',
      version: '1.0.0',
      description: 'ClickProp Real Estate API Documentation',
      contact: {
        name: 'API Support',
        email: 'support@clickprop.com'
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 4000}`,
          description: 'Development server'
        }
      ]
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    './routes/*.js',
    './models/*.js'
  ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(express.json());
app.use(cors());

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/properties', properties);
app.use('/api/cities', cities);
app.use('/api/users', users);
app.use('/api/admin', admin);
app.use('/api/email', email);
app.use('/api/bug-reports', bugReports);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
