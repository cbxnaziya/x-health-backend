// Utility function to validate an email format
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  // Utility function to validate phone number format (example: "+1234567890")
  const validatePhone = (phone) => {
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    return phoneRegex.test(phone);
  };
  
  module.exports = { validateEmail, validatePhone };
  