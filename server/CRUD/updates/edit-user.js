const querystring = require('querystring');
const connection = require('../../db/dbConnect');

const editUserInfo = (req, res, user_id) => {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            // Parse URL-encoded data
            const parsedBody = querystring.parse(body);
            const { firstname, lastname, emailAddress, userType } = parsedBody;

            // Validate user_id
            if (!user_id || isNaN(user_id)) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Invalid user ID" }));
                return;
            }

            // Define the SQL query
            const query = `
                UPDATE user 
                SET 
                  firstname = ?, 
                  lastname = ?, 
                  email_address = ?, 
                  user_type = ?
                WHERE user_id = ?
            `;

            // Execute the query
            connection.query(query, [firstname, lastname, emailAddress, userType, user_id], (err, result) => {
                if (err) {
                    console.error("Database query error:", err.message);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Internal server error" }));
                    return;
                }

                if (result.affectedRows === 0) {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "User not found" }));
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "User updated successfully" }));
                }
            });
        } catch (error) {
            console.error('Error parsing request body:', error.message);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid request data" }));
        }
    });
};

module.exports = editUserInfo;
