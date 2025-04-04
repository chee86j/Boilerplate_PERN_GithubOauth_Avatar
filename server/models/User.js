import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [2, 30]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Set as true for GitHub OAuth users
    validate: {
      len: [6, 100]
    }
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  githubId: {
    type: DataTypes.BIGINT,
    unique: true,
    allowNull: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password') && user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to compare passwords
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default User;