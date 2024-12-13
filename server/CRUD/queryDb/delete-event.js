const connection = require('../../db/dbConnect');

const deleteEvent = (req, res, event_id) => {
  const query = `
    DELETE FROM event WHERE event_id = ?;
  `;

  connection.query(query, [event_id], (err, results) => {
    if (err) {
      console.error("Database query error:", err.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
      return;
    }

    if (results.affectedRows === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Event not found or already deleted" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Event deleted successfully" }));
    }
  });
};

module.exports = deleteEvent;
