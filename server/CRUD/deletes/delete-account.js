const connection = require("../../db/dbConnect");

const deleteAccount = (req, res, user_id) => {

  if (!user_id) {
    console.log("User id is required!");
    res.writeHead(400, {"Content-Type": "application/json"});
    res.end(JSON.stringify({ message: "User id is required!"}));
    return;
  }
  
  try {
    const query = `DELETE FROM user
                 WHERE user_id = ?
                `;

    connection.query(query, [user_id], (err, result) => {
      if (err) {
        console.log(err.message);
        res.writeHead(500, {"Content-Type": "application/json"});
        res.end(JSON.stringify({ message: "Internal server error" }));
        return;
      }

      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify({ success: true, message: `user ${user_id}'s account has been deleted` }));
    })
    
  } catch(err) {
    console.error('Error parsing request body:', err.message);
    res.writeHead(500, {"Content-Type": "application/json"});
    res.end(JSON.stringify({ message: "Invalid request data" }));
  }
}

module.exports = deleteAccount;