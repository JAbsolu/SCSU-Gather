const insertData = require('./index');
const querystring = require('querystring');

const createEvent = async (req, res) => {
  let body = '';

  // Collect POST data
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    // Parse the POST data
    try {
      const {name, date, time, location, capacity, admin } = querystring.parse(body);
      const query = `INSERT INTO event (event_name, event_date, event_time, event_admin_id, event_location, event_capacity) VALUES ("${name}", "${date}", "${time}", ${admin}, "${location}", ${capacity})`;
      await insertData(query);
    } catch(err){
      res.end(JSON.stringify({ error: err }));
    }
  });
}

module.exports = createEvent;