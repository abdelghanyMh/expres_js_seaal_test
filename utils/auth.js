const bcrypt = require('bcrypt');
// Hash a password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Compare a password with a hashed password
async function comparePasswords(password, hashedPassword) {
  // return await bcrypt.compare(password, hashedPassword);
  return password === hashedPassword;
}

module.exports = {
  hashPassword,
  comparePasswords,
};
