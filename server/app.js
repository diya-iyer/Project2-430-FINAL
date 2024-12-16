require('dotenv').config();
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');
const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// MongoDB Setup
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/ProjectManager';
mongoose.connect(dbURI).catch((err) => {
  console.error('Could not connect to database:', err);
  process.exit(1); // Exit on DB connection failure
});

// Redis Setup
const redisClient = redis.createClient({
  url: process.env.REDISCLOUD_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

const startServer = async () => {
  try {
    await redisClient.connect(); // Await Redis connection before proceeding
    console.log('Redis connected successfully.');

    const app = express();

    // Security
    app.use(helmet());

    // Static Assets & Favicon
    app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
    app.use(favicon(path.resolve(__dirname, '../hosted/img/favicon.png')));

    // Middleware
    app.use(compression());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Session Management
    app.use(session({
      key: 'sessionid',
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET || 'Domo Arigato',
      resave: false,
      saveUninitialized: false,
    }));

    // View Engine (Handlebars)
    app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
    app.set('view engine', 'handlebars');
    app.set('views', path.resolve(__dirname, '../views'));

    // Routes
    router(app);

    // Start Server
    app.listen(port, (err) => {
      if (err) {
        console.error('Server failed to start:', err);
        process.exit(1);
      }
      console.log(`Server is running on port ${port}`);
    });

  } catch (err) {
    console.error('Error starting the server:', err);
    process.exit(1); // Exit if Redis fails or any other error occurs
  }
};

// Start the server
startServer();
