const querystring = require('querystring');
const connection = require('../../db/dbConnect');

const updatePassword = (req, res) => {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            // Parse URL-encoded data
            const parsedBody = querystring.parse(body);
            const { user_id, password } = parsedBody;

            console.log("User id:", user_id);
            console.log("User password:", password);

            // Validate inputs
            if (!user_id || isNaN(user_id)) {
                console.error('Invalid or missing user ID.');
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Invalid or missing user ID" }));
                return;
            }

            if (!password) {
                console.error('Password is missing in the request body.');
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Password is required" }));
                return;
            }

            // Define the SQL query
            const query = `
                UPDATE user 
                SET 
                  password = ?
                WHERE user_id = ?
            `;

            // Execute the query
            connection.query(query, [password, user_id], (err, result) => {
                if (err) {
                    console.error("Database query error:", err.message);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Internal server error" }));
                    return;
                }

                if (result.affectedRows === 0) {
                    console.error('No user found with the provided user ID.');
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "User not found" }));
                } else {
                    console.log('Password updated successfully for user ID:', user_id);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Password updated successfully" }));
                }
            });
        } catch (error) {
            console.error('Error parsing request body:', error.message);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid request data" }));
        }
    });
};

module.exports = updatePassword;
