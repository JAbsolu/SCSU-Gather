const connection = require('../../db/dbConnect');

const getUserEvent = (req, res, user_id) => {

  const query = `
    SELECT 
      e.event_id,
      e.event_name, 
      e.event_date, 
      e.event_time, 
      e.event_admin_id, 
      e.event_location, 
      e.event_capacity,
      u.firstname,
      u.lastname,
      u.email_address,
      u.user_type,
      (SELECT COUNT(*) FROM event_attendees ea WHERE ea.event_id = e.event_id) AS attendee_count
    FROM 
      event AS e
    JOIN 
      user AS u 
    ON 
      e.event_admin_id = u.user_id
    WHERE 
      e.event_admin_id = ?;
  `;

  connection.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Database query error:", err.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
      return;
    }

    if (results.length === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "No events found for this user" }));
      return;
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, events: results }));
    }
  });
};

module.exports = getUserEvent;