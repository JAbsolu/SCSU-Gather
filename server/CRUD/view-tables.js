const connection = require('../db/dbConnect');

// View table function
const viewTable = (sql) => {
  connection.query(sql, function (err, result) {
    if (err){ 
    console.log(err.sqlMessage);
    return err.message;
    }
    console.log(result);
    connection.end()
  });
}

sql_statement = "SHOW TABLES";
viewTable(sql_statement);

module.exports = viewTable;