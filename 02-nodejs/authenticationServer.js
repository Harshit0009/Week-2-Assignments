/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express");
const uuid = require("uuid");
const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
app.use(express.json()); // parses json payload
var logs = [];
// creating signup functionality
function handleSignUp(req, res) {
  const uniqueId = uuid.v4();
  var { username, password, firstname, lastname } = req.body;
  console.log(`${username} ${password}`);
  let user = {
    uid: uniqueId,
    username: username,
    password: password,
    firstname: firstname,
    lastname: lastname,
  };
  // console.log(`user: ${user}`);
  let userExists = false;
  for (let i = 0; i < logs.length; i++) {
    if (logs[i].username === user.username) {
      userExists = true;
      break;
    }
  }
  if (userExists) {
    return res.status(400);
  } else {
    logs.push(user);
    // console.log(logs);
    return res.status(201).send("Signup successful");
  }
}

// creating signin functoinality
function handleSignIn(req, res) {
  let { username, password } = req.body;
  let checked = false;
  let index = -1;
  for (let i = 0; i < logs.length; i++) {
    if (logs[i].username === username) {
      if (logs[i].password === password) {
        checked = true;
        index = i;
        break;
      } else {
        return res.status(401);
      }
    }
  }
  console.log(index);
  if (checked) {
    return res.status(200).json({
      success: true,
      uuid: logs[index].uuid,
      firstname: logs[index].firstname,
      lastname: logs[index].lastname,
      username: username,
    });
  } else {
    return res
      .status(401);
  }
}

function handleGetData(req, res) {
  let username = req.headers.username;
  let password = req.headers.password;
  // console.log(username);
  // console.log(password);
  let checked = false;
  // let index = -1;
  for (let i = 0; i < logs.length; i++) {
    if (logs[i].username === username) {
      if (logs[i].password === password) {
        checked = true;
        // index = i;
        console.log(i);
        break;
      } else {
        return res.status(401);
      }
    }
  }
  console.log(checked);
  if (checked) {
    // console.log("inside if block");
    let returnArray = [];
    for (let j = 0; j < logs.length; j++) {
      returnArray.push({
        firstname: logs[j].firstname,
        lastname: logs[j].lastname,
        username: logs[j].username,
      });
    }
    // console.log(returnArray);
    return res.status(200).json({ returnArray });
  } else {
    return res.status(401);
  }
}

app.post("/signup", handleSignUp);
app.post("/login", handleSignIn);
app.get("/data", handleGetData);
// app.get("", (req, res) => {
//   return res.status(404).send("No routes found");
// });
// app.post("", (req, res) => {
//   return res.status(404).send(`No routes found`);
// });

function serverFunc(err) {
  if (err) {
    console.log("error: " + err);
  }
  console.log(`app is running on port 3000.`);
}

// app.listen(PORT, serverFunc);
module.exports = app;
