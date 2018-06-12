var mongodb = require("mongodb")

//connection string
var CONNECTION = "mongodb://" + process.env.USER +":" + process.env.KEY + "@" + process.env.HOST + "/" + process.env.DATABASE;

var database = null; //place to store the database once connected.

function connect(callback){
  //the actual connection.
  mongodb.MongoClient.connect(CONNECTION, function(err, db_obj){ //Connects to the database and returns the connection as an object.
    if(err){
    console.log("Error: failed to connect to the database.")
      callback(err)
    } else{
      database = db_obj
      console.log("Connected to the database.")
      callback(null)
    }
  })
}

function close(){
  //close the connection. Apparently I never get to actually do this.
  if (database != null){
    database.close(function(err){
      if(err){
        console.log("Error: failed to close the connection.")
      } else {
        database = null; //resets the database holder to null.
      }
    })
  }
}

function retrieve_by_username(value, collection, callback){
   if (database != null){ //if a database object is connected
    var db = database.db(process.env.DATABASE).collection(collection); //get the specific database & collection from the object
    db.findOne({username:value}, function(err, data){
      if (data == null){
        callback(null)
      } else {
        callback(data)
      }  
    }) 
  } else {
    console.log("Error: no connection found.")
  }
}

function retrieve_by_id(value, collection, callback){
   if (database != null){ //if a database object is connected
    var db = database.db(process.env.DATABASE).collection(collection); //get the specific database & collection from the object
    db.findOne({_id:value}, function(err, data){
      if (data == null){
        console.log("Failed to find anything.")
        callback(null)
      } else {
        callback(data)
      }  
    }) 
  } else {
    console.log("Error: no connection found.")
  }
}

function retrieve_users(callback){
  if (database != null){ //if a database object is connected
    var db = database.db(process.env.DATABASE).collection("users"); //get the specific database & collection from the object
    db.find({}).toArray(function(err, data){
      if (data == null){
        console.log("Failed to find anything.")
        callback(null)
      } else {
        callback(data)
      }  
    }) 
  } else {
    console.log("Error: no connection found.")
  }
}

function retrieve_user_log(filters, callback){
  if (database != null){ //if a database object is connected
    var db = database.db(process.env.DATABASE).collection("users"); //get the specific database & collection from the object
    db.find(filters).toArray(function(err, data){
      if (data == null){
        console.log("Failed to find anything.")
        callback(null)
      } else {
        callback(data)
      }  
    }) 
  } else {
    console.log("Error: no connection found.")
  }
}


function insert(item, collection){
  if (database != null){ //if a database object is connected
    var db = database.db(process.env.DATABASE); //get the specific database from the object,
    db.collection(collection).insert(item, function(err){ //add the item to the collection.
      if(err){
        console.log("Error: failed to insert data.")
      }
    }); 
  } else {
    console.log("Error: no connection found.")
  }
}

function add_exercise(id, exercises, callback){
  if (database != null){ //if a database object is connected
    var db = database.db(process.env.DATABASE); //get the specific database from the object,
    db.collection("users").update({_id: id}, {sessions: exercises}, function(err){ //add the item to the collection.
      if (err){
        console.log("Error: failed to update records.")
        callback(null)
      } else {
        console.log("Successfully updated records.")
        callback(id);
    }
  })  
  }
}

    
module.exports = {
  connect: connect,
  close: close,
  insert: insert,
  retrieve_by_username: retrieve_by_username,
  retrieve_by_id: retrieve_by_id,
  add_exercise: add_exercise,
  retrieve_users: retrieve_users
};