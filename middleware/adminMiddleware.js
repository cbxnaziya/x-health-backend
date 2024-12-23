// Middleware to verify if the user has an 'admin' role
const adminMiddleware = (req, res, next) => {
  console.log("req.user.role:",req.user.role);
  
    // Check if the user has an 'admin' role
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied. Admins only.' });
    }
    next(); // Proceed to the next middleware or controller
  };
  
  module.exports = adminMiddleware;
  