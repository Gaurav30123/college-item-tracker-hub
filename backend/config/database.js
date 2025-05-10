
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Ensure DB credentials are defined with fallbacks
const dbName = process.env.DB_NAME || 'lost_and_found';
const dbUser = process.env.DB_USER || 'postgres';
const dbPass = process.env.DB_PASS ? String(process.env.DB_PASS) : ''; // Explicitly convert to string
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

// Log DB connection details (omitting password)
console.log(`Connecting to database: ${dbName} at ${dbHost}:${dbPort} with user ${dbUser}`);

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPass,
  {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
