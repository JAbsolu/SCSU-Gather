const connection = require('../../db/dbConnect');

const insertData = (sql) => {
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Data has been inserted to table');
    }
  })
}

module.exports = insertData;