const path = require('path');
const sequelize = require('../config/db');
const models = require('../models');

async function initializeDatabase() {
  try {
    console.log('🔄 Starting database initialization...');
    
    // Test the connection
    console.log('🔌 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync all models
    console.log('📊 Syncing database models...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized successfully.');
    
    // Log available models
    console.log('📝 Available models:', Object.keys(models).join(', '));
    
    console.log('🎉 Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

initializeDatabase(); 