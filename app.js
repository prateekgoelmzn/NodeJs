const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const mongoClient = mongo.MongoClient;
const url = 'mongodb://127.0.0.1:27017/todoapp';
const port = process.env.PORT || 3000;

app.use("/",express.static(__dirname+'/'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.post("/tasks/new",function(req,res){
  mongoClient.connect(url,function(err,db){
    let tasks = db.db('todoapp').collection('tasks');
    tasks.insertOne({
      timestamp: new Date(),
      description: req.body.description
    })
  });
  res.redirect("/");
})

app.get("/tasks",function(req,res){
  mongoClient.connect(url,function(err,db){
    if(!err){
      let tasks = db.db('todoapp').collection('tasks');
      tasks.find({}).toArray(function(error,results){
        res.send(JSON.stringify(results));
      })
    }
  })
})

app.put("/tasks/update/:id",function(req,res){
  mongoClient.connect(url,function(err,db){
    let tasks = db.db('todoapp').collection('tasks');
    tasks.update(
      {_id: new ObjectId(req.params.id)},
      { $set: {
        description: req.body.description
      }});
  })
})

app.delete("/tasks/delete/:id",function(req,res){
  mongoClient.connect(url,function(err,db){
    let tasks = db.db('todoapp').collection('tasks');
    tasks.remove({_id: new ObjectId(req.params.id)},function(error,result){
      if(!err){
        console.log(result);
      }else{console.log(error);}
    })
  })
})

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
})

app.listen(port);
