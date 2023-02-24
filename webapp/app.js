let express = require("express");
var bodyParser = require("body-parser");

let mysql = require("mysql");

let dbhost = process.env["DBHOST"] || "localhost";
let dbPass = process.env["MYSQL_PASSWORD"] || "mysql";

function getConnection() {
  return mysql.createConnection({
    host: dbhost,
    port: 3306,
    user: "mysql",
    password: dbPass,
    database: "mydb",
  });
}

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/registrations", function (req, res) {
  let { firstName, lastName, grade, email, shirtSize, hrUsername } = req.body;

  if (
    !firstName ||
    !lastName ||
    !grade ||
    !email ||
    !shirtSize ||
    !hrUsername
  ) {
    return res.status(400).json({ error: "All fields must be nonblank." });
  }

  if (!["S", "M", "L"].includes(shirtSize)) {
    // shirtSize must be S, M, or L
    return res.status(400).json({ error: "Shirt size must be S, M, or L." });
  }

  if (![9, 10, 11, 12].includes(parseInt(grade))) {
    // grade should be 9, 10, 11, or 12
    return res.status(400).json({ error: "Grade must be 9, 10, 11, or 12." });
  }

  let connection = getConnection();
  connection.connect(function (err) {
    if (err) {
      console.log("Problem connecting to database", err);
      res.status(500).send("Unable to connect to database! " + err);
      return;
    }

    let registration = {
      firstName,
      lastName,
      grade,
      email,
      shirtSize,
      hrUsername,
    };

    let sql_query = "INSERT INTO Registrations SET ?";

    connection.query(sql_query, registration, function (err) {
      if (err) {
        console.log("Problem inserting registration", err);
        res.status(500).send("Unable to insert registration! " + err);
        return;
      }
      res.status(200).send("Registration success!");
      connection.destroy();
    });
  });
});

app.get("/registrations", function (req, res) {
  let connection = getConnection();
  connection.connect(function (err) {
    if (err) {
      console.log("Problem connecting to database", err);
      res.status(500).send("Unable to connect to database! " + err);
      return;
    }
    connection.query("SELECT * FROM Registrations", function (err, results) {
      if (err) {
        console.log("Problem getting registrations", err);
        res.status(500).send("Unable to get registrations! " + err);
        return;
      }
      res.json(results); // JSON response of all registration records
      connection.destroy();
    });
  });
});

let port = process.env["PORT"] || 8888;
port = parseInt(port);
app.listen(port, function () {
  console.log("Express server listening on port " + port);
});
