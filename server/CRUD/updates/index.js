const connection = require('../../db/database');

const updateData = ($sql) => {
  connection.query($sql, (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
    } else {
      console.log('The data has been updated \n');
    }
  })
}

let query = "UPDATE user SET firstname = 'John', password = 'John' WHERE user_id = 1";
updateData(query);

module.exports = updateData;