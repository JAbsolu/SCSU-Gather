const insertData = require('../CRUD/inserts/index');
const querystring = require('querystring');
const connection = require('../db/dbConnect');

const handleSignup = (req, res) => {
  let body = '';

  // Collect POST data
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const { firstname, lastname, email_signup, password_signup, user_type } = querystring.parse(body);

      // Construct SQL query
      const query = `INSERT INTO user (firstname, lastname, email_address, password, user_type) VALUES ("${firstname}", "${lastname}", "${email_signup}", "${password_signup}", "${user_type}")`;

      // Execute the query
      connection.query(query, (err, result) => {
        if (err) {
          console.error('Error during signup:', err.message);

          // Send error response
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
          return;
        }

        console.log('User successfully signed up:', result);

        // Send success response
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Signup successful!" }));
      });
    } catch (err) {
      console.error('Error parsing request body:', err.message);

      // Send bad request response
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid signup data!" }));
    }
  });
};

module.exports = handleSignup;