// connection client for mongodb
const mongoose = require('mongoose');
// promise library
const bluebird = require('bluebird');
//initializing express module
const express = require('express');
//initializing bodyParser module
const bodyParser = require('body-parser');
//initializing the app
const app = express();
// bcrypt module
const bcrypt = require('bcrypt');
const saltRounds = 10;


//assign bluebird to promise
const Promise = bluebird;

mongoose.Promise = bluebird;
mongoose.connect('mongodb://localhost/twitter');

// To pass the object as json
app.use(bodyParser.json());
// app.use(bodyParser());

//to tell express the location of all the html views folder
app.use(express.static('static'));


const user = mongoose.model('user', {
  _id : String,
  password : String,
  following : [{type:String, unique: true}],
  followers : [{type:String, unique: true}]
});


const tweet = mongoose.model('tweet', {
  text : String,
  timestamp : Date,
  username : String
});



app.get('/worldtimeline',function(req,res){
  let tweets = [];
  tweet.find()
  .then(function(twt){
    twt.forEach(function(twt){
      tweets.push(twt);
    });
    res.send(tweets);
  });
});

///------------------ Timeline Tweets:

app.get('/timeline/:username',function(req,res){
  let tweets = [];
  user.findById(req.params.username).limit(20)
  .then(function(usr){
    return tweet.find({
      username : {
        $in : usr.following.concat([usr._id])
      }
    });
  }).then(function(tweets){
    res.send(tweets);
  });
});

app.get('/profile/:username',function(req,res){
  let mytweets = [];
  Promise.all([tweet.find({username : req.params.username}).limit(20),
  user.findOne({_id : req.params.username})
])
.spread(function(twt,usr){
    twt.forEach(function(t){
      mytweets.push(t);
    });
  res.send({mytweets : mytweets, usr : usr});
  });
});

app.post('/profile/:username',function(req,res){
  let twt = new tweet();
  twt.text = req.body.twt;
  twt.timestamp = new Date();
  twt.username = req.params.username;
  twt.save().then(function(){
  console.log("Post Successful");
  res.json(twt);
  });
});

app.post('/signup',function(req,res){
  let usr = new user();
  bcrypt.hash(req.body.password,saltRounds).then(function(hash){
    usr.password = hash;
    console.log("hash"+hash);
    }).then(function(){
      usr._id = req.body.username;
      console.log(usr.password);
      usr.followers = [];
      usr.following = [];
      usr.save().then(function(){
        console.log("Signup Successful");
        res.json(usr);
    });
  });
});

app.post('/login',function(req,res){
  user.findById(req.body.username).then(function(data){
    bcrypt.compare(req.body.password,data.password)
    .then(function(){
      var loggedIn = true;
      console.log("loggedIn");
    });
  });
});
// world tweet


// //profile page
// Promise.all([
//   tweet.find({username : 'trista'}).limit(20),
//   user.find({ _id : 'trista'})
// ])
// .spread(function(twt,usr){
//   twt.forEach(function(t){
//     // console.log(t);
//   });
//   //number of people you are following
//   usr[0].followers.forEach(function(f){
//     console.log(f);
//   });
//     console.log(usr[0].followers.length);
// });

// //followers //following
// user.find({_id : Theuname}).then(function(usr){
//   user.find({_id : Theuname}).then(function(usr){
//     usr.following.forEach(function(u){
//       console.log(u);
//     });
//   });
// });
//
//
// //user timeline


app.listen(3000,function(){
  console.log('Example app listening on port 3000!');
});
