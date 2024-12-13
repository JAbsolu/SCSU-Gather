const connection = require('../../db/dbConnect');
const sessions = require('../../auth/signin').sessions;

const getUserInfo = (req, res) => {
  const cookies = req.headers.cookie;

  if (!cookies) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not authenticated." }));
    return;
  }

  // Extract the session token from cookies
  const sessionCookie = cookies
    .split("; ")
    .find((cookie) => cookie.startsWith("session="));

  if (!sessionCookie) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not authenticated." }));
    return;
  }

  const sessionToken = sessionCookie.split("=")[1];

  // Retrieve user information from the sessions object
  const userSession = sessions[sessionToken];
  if (!userSession) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid session." }));
    return;
  }

  // Query the database for the full user information
  const sql = `SELECT user_id, firstname, lastname, email_address, user_type FROM user WHERE user_id = ?`;
  connection.query(sql, [userSession.user_id], (err, results) => {
    if (err) {
      console.error("Database query error:", err.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error." }));
      return;
    }

    if (results.length === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found." }));
      return;
    }

    // Send back the user's full information
    const user = results[0];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  });
};

module.exports = getUserInfo;
