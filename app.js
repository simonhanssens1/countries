var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var jsdom = require("jsdom"); 
// $ = require("jquery")(jsdom.jsdom().parentWindow()); 

var dbConfig = require('./db');
var mongoose = require('mongoose');
var app = express();
var User = require('./models/user');
//////
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var data = require('./countries.json');


// Configuring Passport
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
  
http.listen(3000);

// Connect to DB
mongoose.connect(dbConfig.url);

var User = mongoose.model('user');

var country;
var letters;
var countCountries = data.length;
var rand1;
var rand2;
var rand3;
//newCountry();
prev = false;
newCountry(prev);
var start = false;
console.log("NEW COUNTRY");

var currentUser = "Meld je aan";


app.use(passport.initialize());
app.use(passport.session());
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/'}), function(req, res) {
    console.log('Facebook');
    res.redirect('/home');
    currentUser = req.user.username;

});

app.use(cookieParser());
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'mySecretKey'}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));


 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: 'public_profile' })
);

var routes = require('./routes/index')(passport);
app.use('/', routes);

passport.use(new FacebookStrategy({
    clientID: "785732111474016",
    clientSecret: "4974e5b56aea27a407c3001e71b749cf",
    callbackURL: "http:localhost:3000/auth/facebook/callback",
    //profileFields: ['id', 'name','picture.type(large)', 'emails', 'gender'], 
 
  },
//   function(accessToken, refreshToken, profile, done) {
    
//     // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//     //   return done(err, user);
      
//     // });User.findOne({ 'username' :  msg[1] }, function(err, user) {

//     // User.findOne({ 'facebook_id' :  profile.id }, function (err, us) {
//     //     if (true) {};
//     // });
//     User.findOne({
//             'facebook_id': profile.id
//         }, function(err, doc) {          
           
//             if (!err && user != null) {
//               done(null, user);
//             } else {
//               var user = new User({
//                 oauthID: profile.id,
//                 name: profile.displayName,
//                 created: Date.now()
//               });
//               user.save(function(err) {
//                 if(err) {
//                   console.log(err);
//                 } else {
//                   console.log("saving user ...");
//                   done(null, user);
//                 };
//             }
//         });
//     }
// ));

function(accessToken, refreshToken, profile, done) {
User.findOne({ facebook_id: profile.id }, function(err, user) {
if(err) { console.log(err); }
if (!err && user != null) {
  done(null, user);
} else {
  var user = new User({
    facebook_id: profile.id,
    username: profile.name.givenName
  });
  user.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("saving user ...");
      done(null, user);
    };
  });
};
});
}
));

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

function newCountry (prev){

    if (prev == false) {
        console.log(countCountries);
        var random = Math.floor((Math.random() * countCountries -1) + 0);
        country = data[random];
    }else{

    };

    var arr = []
    while(arr.length < 3){
      var randomnumber=Math.ceil((Math.random()*country.name.length -1)+0)
      var found=false;
      for(var i=0;i<arr.length;i++){
        if(arr[i]==randomnumber){found=true;break}
      }
      if(!found)arr[arr.length]=randomnumber;
    }
    rand1 = arr[0];
    rand2 = arr[1];
    rand3 = arr[2];
    if(country.name.charAt(rand1) ==' '||country.name.charAt(rand2) == " " || country.name.charAt(rand3) == " " )
    {

        return false;
    }
    console.log("rands voor: " +  country.name + " : " + rand1 + " - "+ rand2 + " - "+ rand3);

    // for (var country = 0; i < data ; i++) {
    //     counCounties ++;
    // };
    letters = country.name.charAt(rand1).toUpperCase() + " - " + country.name.charAt(rand2).toUpperCase() + " - " + country.name.charAt(rand3).toUpperCase()
    return letters;
}

io.on('connection', function(socket){
    io.emit('plaats letters', letters);
    console.log("plaats letters");
    io.emit('zet user', currentUser);
    console.log("zet user" + currentUser);
    // prev = true;
    // var nC = newCountry(prev);
    // if(nC !== false){             
    //     io.emit('new country message', nC);    
    // }else{

    // }  

 


  socket.on('game message', function(msg){
    var d=[];
    d[0] = msg;
    d[1] = currentUser;
    io.emit('game message', msg);
    console.log(currentUser);
    // if(msg == "kapper"){
    //  io.emit('chat message', "u bent gewonnen")
    // }
    var input = String(msg[0] + '');
    if(input == "start" && start == false){
        io.emit('start message', "Veel plezier!");
        io.emit('new country message', newCountry());
    }else{
        var input = input.toLowerCase();


         for (var i =0; i < countCountries -1; i++) {
            if(input == data[i].name.toLowerCase()){
                console.log(input.charAt(0));
                console.log("erin");
                console.log(country.name.charAt(rand1).toLowerCase()); 
                console.log(input.indexOf(country.name.charAt(rand1)));   
                if(input.indexOf(country.name.charAt(rand1).toLowerCase()) !== -1)
                { 
                    console.log(country.name.charAt(rand2));     
                    console.log(input.indexOf(country.name.charAt(rand2)));       
                    if(input.indexOf(country.name.charAt(rand2).toLowerCase()) !== -1)
                    {    
                        console.log(country.name.charAt(rand3));
                        console.log(input.indexOf(country.name.charAt(rand3)));   
                        if(input.indexOf(country.name.charAt(rand3).toLowerCase()) !== -1)
                        {
                            console.log("JUIST");
                            io.emit('game finish message', msg[1] + " heeft gewonnen");
                            io.emit('game finish message', "Zoek snel het nieuwe land!");
                            io.emit('add winner', msg[1].username);
                            User.findOne({ 'username' :  msg[1] }, function(err, u) {
                               console.log("update score for  " + u.highscore);
                               if(isNaN(u.highscore)){
                                u.highscore = 1;
                                console.log("high is not a number");
                               }else{
                                u.highscore = u.highscore++;
                               }                               
                                
                                u.save();
                            });
                            var users;
                            User.find({}, function (err, us) {
                                
                                users = us;
                                io.emit('all users',users);
                            });

                            prev = false;
                            var nC = newCountry(prev);
                            console.log("nieuwe country aanmaken");
                            if(nC !== false){
                                
                                io.emit('new country message', nC);    
                            }else{

                            }                        
                            
                            // $("#letters").append(country.name);
                        }
                    }   
                }           
            }
        };       
    }


  });
  socket.on('chat message', function(data){
      io.emit('chat message', data);
  });


  // socket.on('doc ready', function(){
  //       prev = true;
  //       var nC = newCountry(prev);
  //       if(nC !== false){             
  //           io.emit('new country message', nC);    
  //       }else{

  //       }  

  //       User.find({}, function (err, us) {            
  //           users = us;
  //           io.emit('all users',users);
  //       });     
  // });

});




module.exports = app;
