const connection = require('../db/dbConnect');

// Create user table
const createUserTable = `
  CREATE TABLE IF NOT EXISTS user (
    user_id INT NOT NULL AUTO_INCREMENT,
    firstname VARCHAR(100), 
    lastname VARCHAR(100),
    email_address VARCHAR(255),
    password VARCHAR(255),
    user_type VARCHAR(100),
    UNIQUE (email_address),
    PRIMARY KEY (user_id)
  );
`;

// Create event table
const createEventTable = `
  CREATE TABLE IF NOT EXISTS event (
    event_id INT NOT NULL AUTO_INCREMENT,
    event_name VARCHAR(255), 
    event_date DATE,
    event_time TIME,
    event_admin_id INT,
    event_location VARCHAR(250),
    event_capacity INT,
    PRIMARY KEY (event_id),
    FOREIGN KEY (event_admin_id) REFERENCES user (user_id)
  );
`;

// Create junction table for event attendees
const createEventAttendeesTable = `
  CREATE TABLE IF NOT EXISTS event_attendees (
    event_id INT,
    user_id INT,
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES event (event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE
  );
`;

// Function to execute queries
const createTable = (sql) => {
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err.sqlMessage);
      // close the connection
      connection.end();
    } else {
      console.log("Table has been created or already exists.");
      // close the connection
      connection.end()
    }
  });
};

// Execute table creation
createTable(createUserTable);
createTable(createEventTable);
createTable(createEventAttendeesTable);