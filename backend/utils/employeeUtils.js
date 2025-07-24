// utils/employeeUtils.js
function generateRandomPassword(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!%&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function generateLoginId(name) {
  const base = name.toLowerCase().split(' ')[0]; // first name
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `${base}${random}`; // e.g., sunny4382
}

module.exports = { generateRandomPassword, generateLoginId };
