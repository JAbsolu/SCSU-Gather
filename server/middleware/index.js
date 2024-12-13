const signin = require('../auth/signin');

const isAuthenticated = (req) => {
  const cookies = req.headers.cookie;
  if (!cookies) return false;

  const sessionToken = cookies.split(";").find((c) => c.trim().startsWith("session="));
  if (!sessionToken) return false;

  const token = sessionToken.split("=")[1];
  return signin.sessions[token] || false; // Return session data or false
};

module.exports = isAuthenticated;