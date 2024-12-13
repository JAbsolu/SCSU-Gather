const connection = require('../db/database');

/**
 * @param {*} sql - a string of sql statement
 * @param {*} tableName - a string
 */

const dropTable = (sql, tableName) => {
  sql = `${sql} ${tableName}`
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
      connection.end();
    } else {
      console.log(`Table ${tableName} has been dropped.`);
      connection.end();
    }
  });
}

const sql = "DROP TABLE";

// dropTable(sql, 'event_attendees');
// dropTable(sql, 'event');
dropTable(sql, 'user');
