import sequelize from '../config/db.js';
import { User } from '../models/index.js';

async function updateSchema() {
  try {
    console.log('🔄 Starting schema update...');
    
    // Force sync will drop and recreate the table
    await User.sync({ force: true });
    
    console.log('✅ Schema updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Schema update failed:', error);
    process.exit(1);
  }
}

updateSchema(); 