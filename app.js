var createError = require('http-errors');
var express = require('express');
http = require('http');
var app = express();

var bodyParser = require('body-parser')

const sql = require("sqlite3");
const db = new sql.Database("./test.db", (err) => {
  if(err){
    console.error("Database error: " + err.message);
  } else {
    db.serialize(() => {
      db.run("drop table if exists members");
      db.run("create table if not exists members( \
        id integer primary key autoincrement, \
	name nverchar(32), \
	pwd  nverchar(32) \
      )" , (err) => {
	if (err) {
	  console.error("table error: "+ err.message);
	} else {
	  db.run("insert into members(name, pwd) values(?, ?)", "Mike", "password1");
	  db.run("insert into members(name, pwd) values(?, ?)", "Hanako", "password2");
	  db.run("insert into members(name, pwd) values(?, ?)", "Tony", "password3");
        }
      });
    });
  }
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.post('/students', (req, res) =>{
  console.log(req.body);
  res.send("Received POST Data");
});

app.get('/:name/:pwd', function(req, res) {
  const name = req.params.name;
  const pwd = req.params.pwd;
  db.get("select * from members where name = ? AND pwd = ?", name, pwd, (err, row) => {
    if (err) {
      res.status(400).json({
        "status": "error",
	"message": err.message
      });
      return;
    } else {
      res.status(200).json({
        "status": "OK",
	"members": row 
      });
    }
  });
});

var server = app.listen(5000, function(){
  console.log('Server is running');
});
module.exports = app;
