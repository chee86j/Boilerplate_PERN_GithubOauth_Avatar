const errorHandler = (err, req, res, next) => {
    console.error('🔴 Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  
    // Handle specific error types
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: err.errors.map(e => e.message)
      });
    }
  
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: 'Conflict',
        details: err.errors.map(e => e.message)
      });
    }
  
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        details: 'Please log in again'
      });
    }
  
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        details: 'Please log in again'
      });
    }
  
    // Handle file upload errors
    if (err.name === 'MulterError') {
      return res.status(400).json({
        error: 'File upload error',
        details: err.message
      });
    }
  
    // Handle Sequelize errors
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Database Validation Error',
        details: err.errors.map(e => e.message)
      });
    }
  
    if (err.name === 'SequelizeDatabaseError') {
      return res.status(500).json({
        error: 'Database Error',
        details: process.env.NODE_ENV === 'development' ? err.message : 'An internal error occurred'
      });
    }
  
    // Default error
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  };
  
  module.exports = errorHandler;