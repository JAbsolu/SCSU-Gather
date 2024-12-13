const connection = require("./dbConnect");
const DbName = "SCSUGather";
const query = `CREATE DATABASE IF NOT EXISTS ${DbName}`;

connection.query(query, (err, result) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Database ${DbName} has been created!`)
  return;
})