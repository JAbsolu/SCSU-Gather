const connection = require('../../db/createDB');

const deleteData = ($sql) => {
  connection.query($sql, (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
      return err.sqlMessage;
    } else {
      console.log('The request has been deleted from table \n');
      return 'The data has been deleted from table';
    }
  })
}

let query = "DELETE FROM user WHERE user_id = 1";
deleteData(query);

module.exports = deleteData;