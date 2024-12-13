const connection = require("../../db/dbConnect");

const registerForvent = (req, res, event_id, user_id) => {
    try {
      const query = "INSERT INTO event_attendees (event_id, user_id) VALUES (?, ?)";

      connection.query(query, [event_id, user_id], (err, result) => {
        if (err) {
          console.error(err);
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: err.message }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "You have registered for the event"}))
      });

    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: err }));
    }
}

module.exports = registerForvent;