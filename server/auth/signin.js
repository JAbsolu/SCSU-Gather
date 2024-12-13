const connection = require('../db/dbConnect');
const crypto = require('crypto');
const sessions = {};

const parseJSONBody = (req, callback) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    try {
      const parsedBody = JSON.parse(body);
      callback(null, parsedBody);
    } catch (error) {
      callback(error);
    }
  });
};


const signIn = (email, password, res) => {
  const sql = `SELECT * FROM user WHERE email_address = "${email}" AND password = "${password}"`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log('Full error', err);
      console.error("Database query error:", err.message);

      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error." }));
    } else if (results.length === 0) {
      console.log('Lenthg is 0 | no results');

      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid email or password." }));
    } else {
      const user = results[0];
      console.log('user is found', user.firstname);

      // generate session token
      const sessionToken = crypto.randomBytes(16).toString('hex');
      // store session in memory
      sessions[sessionToken] = { user_id: user.user_id, email: user.email_address };

      res.writeHead(200, { 
        "Content-Type": "application/json", 
        "Set-Cookie": `session=${sessionToken}; HttpOnly; Path=/`,
      });
      res.end(
        JSON.stringify({
          user_id: user.user_id,
          firstname: user.firstname,
          lastname: user.lastname,
          user_type: user.user_type,
        })
      );
    }
  });
};

module.exports = { parseJSONBody, signIn, sessions };