const connection = require("../../db/dbConnect");

const getAllEvents = (res) => {
  const query = "SELECT * FROM event";

  connection.query(query, (err, results) => {
    if (err) {
      res.writeHead(404, { "Content-Type" : "application/json" });
      res.end(JSON.stringify({ message : "No events found"}))
      return;
    }

    res.writeHead(200, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ success: true, data: results }));

  })
}

module.exports = getAllEvents;