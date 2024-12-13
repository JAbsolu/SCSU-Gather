const connection = require('../../db/dbConnect');

const findData = (sql) => {
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log('Data has been inserted to table');
    }
  })
}

module.exports = findData;