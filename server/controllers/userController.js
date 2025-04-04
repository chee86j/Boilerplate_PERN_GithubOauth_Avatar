import { User } from '../models/index.js';
import { saveImage, deleteFile, isValidImageDataUrl } from '../utils/images.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      githubId: user.githubId
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Update request received:', {
      body: req.body,
      file: req.file,
      contentType: req.headers['content-type']
    });

    const updates = { ...req.body };

    // Handle file upload if present
    if (req.file) {
      try {
        // If there's an existing avatar, delete it
        if (user.avatar) {
          const oldAvatarPath = path.join(__dirname, '..', user.avatar);
          await deleteFile(oldAvatarPath);
        }
        
        // Update the avatar path in the updates object
        updates.avatar = `/uploads/${req.file.filename}`;
      } catch (error) {
        console.error('Avatar update error:', error);
        return res.status(500).json({ error: 'Failed to update avatar' });
      }
    }
    // Handle base64 avatar if present
    else if (updates.avatar && isValidImageDataUrl(updates.avatar)) {
      try {
        // Set up the uploads directory
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        
        // Generate a unique filename
        const fileName = `avatar-${user.id}-${Date.now()}.jpg`;
        
        // Save the new avatar
        const filePath = await saveImage(updates.avatar, uploadsDir, fileName);
        
        // If there's an existing avatar, delete it
        if (user.avatar) {
          const oldAvatarPath = path.join(__dirname, '..', user.avatar);
          await deleteFile(oldAvatarPath);
        }
        
        // Update the avatar path in the updates object
        updates.avatar = `/uploads/${fileName}`;
      } catch (error) {
        console.error('Avatar update error:', error);
        return res.status(500).json({ error: 'Failed to update avatar' });
      }
    }

    // Remove avatar from updates if it wasn't changed
    if (!req.file && !updates.avatar) {
      delete updates.avatar;
    }

    console.log('Applying updates:', updates);

    // Update the user
    await user.update(updates);
    
    // Return the updated user data
    const updatedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      githubId: user.githubId
    };

    console.log('User updated successfully:', updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user's avatar if it exists
    if (user.avatar) {
      try {
        const avatarPath = path.join(__dirname, '..', user.avatar);
        await deleteFile(avatarPath);
      } catch (error) {
        console.error('Error deleting avatar during account deletion:', error);
      }
    }

    // Delete the user
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: error.message });
  }
};