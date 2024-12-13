const connection = require('../../db/dbConnect');

const editEvent = (req, res) => {
    let body = '';

    // Collect POST data
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            // Parse the request body
            const { event_name, event_date, event_time, event_admin_id, event_location, event_capacity, event_id } = JSON.parse(body);

            const query = `
                UPDATE event 
                SET 
                    event_name = ?, 
                    event_date = ?, 
                    event_time = ?, 
                    event_admin_id = ?, 
                    event_location = ?, 
                    event_capacity = ?
                WHERE event_id = ?
            `;

            connection.query(query, [event_name, event_date, event_time, event_admin_id, event_location, event_capacity, event_id], (err, result) => {
                if (err) {
                    console.error("Database query error:", err.message);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Internal server error" }));
                    return;
                }

                if (result.affectedRows === 0) {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Event not found" }));
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Event updated successfully" }));
                }
            });
        } catch (error) {
            console.error('Error parsing request body:', error.message);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid request data" }));
        }
    });
};

module.exports = editEvent;
