const connection = require('../../db/dbConnect');

const getThisEvent = (req, res, event_id) => {

  const query = `SELECT event_admin_id, event_name, event_date, event_time, event_location, event_capacity
                 From event
                 WHERE event_id = ?`;

  connection.query(query, [event_id], (err , result) => {
    if (err) {
      console.log(err.sqlMessage);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({error: err}));
      return;
    }

    if (result.length === 0) {
      console.log('No event is found');
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({err: "No event is found"}));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({success: true, data: result}));
    console.log(result);
  })

};

module.exports = getThisEvent;