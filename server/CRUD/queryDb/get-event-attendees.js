const connection = require("../../db/dbConnect");

const getEventAttendees = (req, res, event_id) => {
  // Query to join event_attendees and user tables
  const query = `
    SELECT 
      u.firstname, 
      u.lastname, 
      u.email_address, 
      u.user_type 
    FROM 
      event_attendees AS ea
    JOIN 
      user AS u 
    ON 
      ea.user_id = u.user_id
    WHERE 
      ea.event_id = ?;
  `;

  try {
    connection.query(query, [event_id], (err, results) => {
      if (err) {
        console.error("Database query error:", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Database query error", error: err.message }));
        return;
      }

      if (results.length === 0) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "No attendees found for this event." }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: results }));
    });
  } catch (err) {
    console.error("Unexpected error:", err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "An unexpected error occurred", message: err.message }));
  }
};

module.exports = getEventAttendees;