import sequelize from '../config/db.js';
import { User } from '../models/index.js';

async function initializeDatabase() {
  try {
    // Force sync will drop existing tables and recreate them
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 