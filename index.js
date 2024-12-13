const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const mime = require("mime-types");
const connection = require("./server/db/dbConnect");
const getTableData = require("./server/CRUD/get-table-data");
const insertDate = require("./server/CRUD/inserts");
const querystring = require("querystring");
const handleSignup = require("./server/auth/signup");
const signinAuth = require("./server/auth/signin");
const isAuthenticated = require("./server/middleware/index");
const getUserInfo = require("./server/CRUD/queryDb/get-user-info");
const createEvent = require("./server/CRUD/inserts/create-event");
const getUserEvent = require("./server/CRUD/queryDb/get-user-event");
const deleteEvent = require("./server/CRUD/queryDb/delete-event");
const getThisEvent = require("./server/CRUD/queryDb/get-event");
const editEvent = require("./server/CRUD/updates/edit-event");
const getAllEvents = require("./server/CRUD/queryDb/get-all-events");
const getEventAttendees = require("./server/CRUD/queryDb/get-event-attendees");
const registerForvent = require("./server/CRUD/inserts/register-for-event");
const editUserInfo = require("./server/CRUD/updates/edit-user");
const getUserPwd = require("./server/CRUD/queryDb/get-user-pwd");
const updatePassword = require("./server/CRUD/updates/update-password");
const deleteAccount = require("./server/CRUD/deletes/delete-account");

const serveFile = (filePath, res) => {
  if (filePath === 'client/' || filePath === 'client') {
    filePath = 'client/index.html';
  }

  fs.readFile(filePath, (err, data) => {
    const contentType = mime.lookup(filePath) || 'application/octet-stream';

    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('File not found');
      res.end();
      console.error('Error reading file:', err.message);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.write(data);
      res.end();
      console.log(`File served: ${filePath}`);
    }
  });
};


// server
const server = http.createServer((req, res) => {
  let parsedUrl = url.parse(req.url, true); // Parse query parameters
  let pathName = `client${parsedUrl.pathname}`;
  const userSession = isAuthenticated(req);

  if (pathName === "client/users" && req.method === "GET") {
    getTableData(res, "SELECT * FROM user");

  } else if (pathName === "client/signup" && req.method === "POST") {
    handleSignup(req, res);

  } else if (pathName === "client/signin" && req.method === "POST") {
    signinAuth.parseJSONBody(req, (err, body) => {
      if (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid request format." }));
        return;
      }

      const { email, password } = body; // get email and password from body
      signinAuth.signIn(email, password, res); // call the sign in function from auth/sign.js
    });

   } else if (pathName.includes("dashboard/")) {
      // check if the user is logged in
      if (userSession === false) {
        res.writeHead(302, { Location: '/auth.html' }); // Redirect to auth.html
        res.end();
      } else {
        serveFile(pathName, res);
      }
      
   } else if (pathName === "client/create-event" && req.method === "POST") {
     // check if the user is logged in
     createEvent(req, res);

   } else if (pathName === "client/get-user-events" && req.method === "GET") {
    const user_id = parsedUrl.query.userid;
    getUserEvent(req, res, user_id);

   } else if (pathName === "client/delete-event" && req.method === "DELETE") {
    const event_id = parsedUrl.query.event_id;
    deleteEvent(req, res, event_id);

   } else if (pathName === "client/get-event" && req.method === "GET") {
    const event_id = parsedUrl.query.event_id;
    getThisEvent(req, res, event_id);

   } else if (pathName === "client/edit-event" && req.method === "PUT") {
    editEvent(req, res);

   } else if (pathName === "client/events") {
    getAllEvents(res);

   } else if (pathName === "client/attendees") {
    const event_id = parsedUrl.query.event_id;
    getEventAttendees(req, res, event_id);

   }else if (pathName === "client/event-registration") {
    const event_id = parsedUrl.query.event_id; // get event id
    const user_id = parsedUrl.query.user_id; // get user id
    registerForvent(req, res, event_id, user_id);

  } else if (pathName === "client/edit-user") {
    const user_id = parsedUrl.query.user_id; // get user id
    editUserInfo(req, res, user_id);

  } else if (pathName === "client/user-password") {
    getUserPwd(req, res);

  } else if (pathName === "client/update-password") {
    updatePassword(req, res);

  } else if (pathName === "client/delete-account") {
    const user_id = parsedUrl.query.user_id; // get user id
    deleteAccount(req, res, user_id);
    
  } else if (pathName === "client/user") {
      getUserInfo(req, res)

   } else {
    serveFile(pathName, res);
    
  }

});

const PORT = 80;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
