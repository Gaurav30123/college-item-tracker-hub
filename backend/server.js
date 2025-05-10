
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Lost and Found API is running');
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database models - force:true will drop and recreate all tables
    // This is useful for initial setup but be careful in production!
    await sequelize.sync({ force: true });
    console.log('Database synchronized - tables created successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    console.error('Please check your .env file and ensure database credentials are correct.');
    console.error('Make sure your database name, username, and password match your PostgreSQL settings.');
    console.error('Database connection will be retried when API endpoints are accessed.');
  }
});
