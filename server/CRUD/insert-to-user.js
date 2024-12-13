const connection = require("../db/dbConnect");

const users = [
  { firstname: "John", lastname: "Doe", email_address: "johndoe@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Jane", lastname: "Smith", email_address: "janesmith@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "Alice", lastname: "Brown", email_address: "alicebrown@southernct.edu", password: "password123", user_type: "Faculty" },
  { firstname: "Bob", lastname: "Johnson", email_address: "bobjohnson@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Charlie", lastname: "Davis", email_address: "charliedavis@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "Emily", lastname: "Wilson", email_address: "emilywilson@southernct.edu", password: "password123", user_type: "Faculty" },
  { firstname: "David", lastname: "White", email_address: "davidwhite@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Olivia", lastname: "Harris", email_address: "oliviaharris@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "Ethan", lastname: "Clark", email_address: "ethanclark@southernct.edu", password: "password123", user_type: "Faculty" },
  { firstname: "Sophia", lastname: "Lewis", email_address: "sophialewis@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Liam", lastname: "Lee", email_address: "liamlee@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "Ava", lastname: "Walker", email_address: "avawalker@southernct.edu", password: "password123", user_type: "Faculty" },
  { firstname: "Mason", lastname: "Hall", email_address: "masonhall@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Isabella", lastname: "Allen", email_address: "isabellaallen@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "Noah", lastname: "Young", email_address: "noahyoung@southernct.edu", password: "password123", user_type: "Faculty" },
  { firstname: "Mia", lastname: "King", email_address: "miaking@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Lucas", lastname: "Scott", email_address: "lucasscott@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "Amelia", lastname: "Green", email_address: "ameliagreen@southernct.edu", password: "password123", user_type: "Faculty" },
  { firstname: "Elijah", lastname: "Baker", email_address: "elijahbaker@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Charlotte", lastname: "Adams", email_address: "charlotteadams@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "James", lastname: "Parker", email_address: "jamesparker@southernct.edu", password: "password123", user_type: "Faculty" },
  { firstname: "Harper", lastname: "Rivera", email_address: "harperrivera@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Benjamin", lastname: "Mitchell", email_address: "benjaminmitchell@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "Evelyn", lastname: "Perez", email_address: "evelynperez@southernct.edu", password: "password123", user_type: "Faculty" },
  { firstname: "Aiden", lastname: "Roberts", email_address: "aidenroberts@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Abigail", lastname: "Carter", email_address: "abigailcarter@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "Jackson", lastname: "Phillips", email_address: "jacksonphillips@southernct.edu", password: "password123", user_type: "Faculty" },
  { firstname: "Ella", lastname: "Evans", email_address: "ellaevans@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Sebastian", lastname: "Turner", email_address: "sebastianturner@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "Avery", lastname: "Torres", email_address: "averytorres@southernct.edu", password: "password123", user_type: "Faculty" },
  { firstname: "Matthew", lastname: "Collins", email_address: "matthewcollins@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Sofia", lastname: "Edwards", email_address: "sofiaedwards@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "Oliver", lastname: "Stewart", email_address: "oliverstewart@southernct.edu", password: "password123", user_type: "Faculty" },
  { firstname: "Aria", lastname: "Morris", email_address: "ariamorris@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Henry", lastname: "Rogers", email_address: "henryrogers@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "Scarlett", lastname: "Reed", email_address: "scarlettreed@southernct.edu", password: "password123", user_type: "Faculty" },
  { firstname: "Alexander", lastname: "Cook", email_address: "alexandercook@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Chloe", lastname: "Morgan", email_address: "chloemorgan@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "Mila", lastname: "Bell", email_address: "milabell@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Daniel", lastname: "Perry", email_address: "danielperry@southernct.edu", password: "password123", user_type: "Faculty" },
  { firstname: "Victoria", lastname: "Bailey", email_address: "victoriabailey@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "Logan", lastname: "Foster", email_address: "loganfoster@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Grace", lastname: "Sanders", email_address: "gracesanders@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "Ryan", lastname: "Morales", email_address: "ryanmorales@southernct.edu", password: "password123", user_type: "Faculty" },
  { firstname: "Zoe", lastname: "Price", email_address: "zoeprice@southernct.edu", password: "password123", user_type: "Student" },
  { firstname: "Nathan", lastname: "Griffin", email_address: "nathangriffin@southernct.edu", password: "password123", user_type: "Staff" },
  { firstname: "Layla", lastname: "Hayes", email_address: "laylahayes@southernct.edu", password: "password123", user_type: "Faculty" },
];

// Generate SQL insert queries for each user
users.map(user => {
  const query = `INSERT INTO user (firstname, lastname, email_address, password, user_type) VALUES ('${user.firstname}', '${user.lastname}', '${user.email_address}', '${user.password}', '${user.user_type}');`;
  connection.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return
    }
    
    console.log(`User ${user.firstname} ${user.lastname} has been insterted \n ${result}`)
  })
});

