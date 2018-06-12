const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var database = require("./database_connections");
var utilities = require("./utilities");

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'))

app.get("/", function(req, res){
  res.sendFile(__dirname + '/views/index.html')
})

app.post("/api/exercise/new-user", function(req, res){
  if (req.body.username != ""){
    database.retrieve_by_username(req.body.username, "users", function(data){
      console.log()
      if (data == null){
        let user = {username : req.body.username};
        user._id = utilities.generate_id();
        user.sessions = [];
        database.insert(user, "users");
        res.send(user);
      } else {
        res.send("That username is already taken.")
      }
    })
  } else {
    res.send("No user entered");
  }
})

app.post("/api/exercise/add", function(req, res){
  let id = req.body.userId
  database.retrieve_by_id(id, "users", function(data){
    if (data == null){
      res.send("No such user found.")
    } else {
      let desc = req.body.description
      let dur = req.body.duration
      let date = req.body.date
      if (date.length < 1){
        date = new Date().toISOString().substring(0, 10);
      }
      let record = {
        description: desc,
        duration: dur,
        date: date
      } 
      let records = data.sessions
      records.push(record)
      database.add_exercise(id, records, function(err){
        if (err == null){
          res.send("Failed to update records")
        } else {
          data.sessions = records;
          res.send(data)
        }
      })
    }
  })
})

app.get("/api/exercise/log", function(req, res){
  let id = req.query.id
  database.retrieve_by_id(id, "users", function(data){
    if (data == null){
      res.send("No such user found.")
    } else {
      let final = {
        id: data._id,
        username: data.username,
        count: 0,
        sessions: data.sessions
      }
      if (req.query.from != undefined){
        console.log("from")
        let from_date = utilities.datify(req.query.from);
        final.sessions = final.sessions.filter(function(e){
          return utilities.datify(e.date) >= from_date; 
        })
      }
      if (req.query.to != undefined){
        let to_date = utilities.datify(req.query.to);
        final.sessions = final.sessions.filter(function(e){
          return utilities.datify(e.date) <= to_date; 
        })
      }
      if (req.query.limit != undefined){
        final.sessions = final.sessions.slice(0, req.query.limit - 1)
      }
      res.send(final)
    }
  })
})

app.get("/api/exercise/users", function(req, res){
  database.retrieve_users(function(data){
    if (data != null){
      console.log(data)
      res.send(data)
    } else {
      res.send("No users found.")
    }
  })
})
                    

database.connect(function(){
  app.listen(process.env.PORT)
})
