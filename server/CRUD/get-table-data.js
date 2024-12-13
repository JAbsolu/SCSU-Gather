const connection = require('../db/dbConnect');

const getTableData = (res, sql) => {
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Database query error:', err.sqlMessage || err.message);
      // Send a 500 error response as JSON
      res.end(JSON.stringify({ error: 'An error occurred while fetching data.' }));
    } else {
      // Send the result as a JSON response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      console.log(result)
      res.end(JSON.stringify(result));
    }
  });
};

module.exports = getTableData;