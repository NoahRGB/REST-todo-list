const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
})); //urlenocded allows the data from PUT and POST requests to be interpreted as arrays and strings
app.set('view engine', 'ejs');

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port: "3306",
  database: "todolist"
});

db.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log("Connected");
});

//create database
app.get("/createdatabase", (req, res) => {
  var sql = "CREATE DATABASE todolist";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
  });
});

//create table
app.get("/createlist", (req, res) => {
  let sql = "CREATE TABLE list(id int AUTO_INCREMENT, description VARCHAR(255), PRIMARY KEY(id))";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("Table created");
  });
});


app.get('/', (req, res) => {
  // res.sendFile(__dirname+'/frontend/index.html');
  res.render('pages/index');
});

// app.get('/todo', (req, res) => {
//   sql = "SELECT * FROM list";
//   db.query(sql, (err, results) => {
//     if (err) {
//       throw err;
//     }
//     //display on html page
//   });
// });

app.post('/todo', (req, res) => {
  //input validation on variables we assume are present
  //using Joi for validation, allows you to check input against a schema
  const schema = Joi.object({
    description: Joi.string().min(3).required()
  });
  const result = schema.validate(req.body);
  if (result.error) {
    //status code 400 = bad request
    //result.error includes an array of errors and details on them
    res.status(400).send(result.error.details[0].message);
    return;
  }

  //inserts the item into the database
  var sql = "INSERT INTO list SET ?";
  var todoitem = {description: req.body.description};
  db.query(sql, todoitem, err => {
    if (err) {
      throw err;
    }
  });
  // res.sendFile(__dirname+"/frontend/todolist.html");
  var todoList = [];
  sql = "SELECT * FROM list";
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    for (var i = 0; i < results.length; i++) {
      todoList.push([results[i]["id"], results[i]["description"]]);
    }
    res.render('pages/todolist', {
      output: todoList
    });
  });

});


//This means that when deployed, the port can be assigned dynamically based on env variables (or just on port 3000 if not)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server listening on port "+port));
