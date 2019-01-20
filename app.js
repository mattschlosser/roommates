const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session'); 
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


var users = [{id: 2, email: "websitemakingguy@gmail.com", firstName: "Matt", lastName: "Schlosser", password: "1234"}];
var user = users[0];
// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
      console.log('Inside local strategy callback')
      // here is where you make a call to the database
      // to find the user based on their username or email address
      // for now, we'll just pretend we found that it was users[0]
      const user = users[0] 
      if(email === user.email && password === user.password) {  
        console.log('Local strategy returned true')
        return done(null, user)
      }
    }
  ));
  
  // tell passport how to serialize the user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const user = users[0].id === id ? users[0] : false; 
    done(null, user);
  });

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    genid: (req) => {
      return uuid() // use UUIDs for session IDs
    },
    secret: 'hippo idk',
    resave: false,
    saveUninitialized: true
  }))
app.use(passport.initialize());
app.use(passport.session());

var household = {id: 1, name: "HMS Hamster"};
var chores = [{id: 1, firstName: "Matt", lastName: "Schlosser", chore: "do the dishes"},
         {id: 2, firstName: "Connor", lastName: "Clark", chore: "clean the bathroom"},
         {id: 3, firstName: "Cameron", lastName: "Clark", chore: "sweep the floors"},
         {id: 4, firstName: "Daniel", lastName: "Clark", chore: "being cool"}];
var groceries = [{id: 1, firstName: "Matt", lastName: "Schlosser", item: "bananas"},
                 {id: 2, firstName: "Connor", lastName: "Clark", item: "brocolli"}]

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

var db = new sqlite3.Database(__dirname + '/my.db');
console.log(db);
db.all("SELECT * FROM households", (err, rows) => {
    console.log(rows);
});
app.get('/', function(req, res) {
    // render the home page
    res.render("home");
})

app.get("/register", function(req, res) {
    res.render("register");
});

app.get("/login", function(req, res) {
    res.render("login");
})

app.post("/login", function(req, res, next) {
    // do something
    console.log(req.body);
    passport.authenticate('local', (err, user, info) => {
        req.login(user, (err) => {
          return res.send('You were authenticated & logged in!\n');
        })
      })(req, res, next);
})

app.get("/chores", function(req, res) {
    // get chores for user and send to the thing
    res.render("chores", {user: user, household: household, chores: chores});
});

app.get("/chore/new", function(req, res) {
    // add a new chore
    res.render("chore", {user: user, household: household, roommates: roomates});
});

app.post("/chore/new", function(req, res) {
    
})

app.put("/chore/:id", function(req, res) {
    // update a chore as done.
    id = req.params.id;
    console.log(id);
})

app.get("/groceries", function(req, res) {
    // get the grocery list and display to user
    res.render("groceries", {user: user, household: household, groceries: groceries})
});

// create household
app.get("/household/new", function(req, res) {
    // Make a new household
    res.render("addHousehold", {user: user})
});

app.post("/households", function(req,res,next) {
    console.log(req.body);
    newHousehold = req.body;
    db.run("INSERT INTO households(name,street,city) values(?,?,?);", [newHousehold.name, newHousehold.street, newHousehold.city], (err) => {
        console.log(err);
    })
    res.redirect("/households");
})

// read households
app.get("/households", function(req, res) {
    // list households;
    households = [{id: 1, name: "HMS Hamster", street: "11151 78 Ave NW", city: "Edmonton, AB"}];
    res.render("households", {user: user, households: households});
});

// read household
app.get("/household/:id", function(req, res) {
    // view an individual household
    // do some seelct based on req.params.  id... say we get:
    db.get("SELECT household,name,street,city FROM households WHERE household = ?;", [req.params.id], (err, row) =>{
        roommates = [{id: 1, firstName: "Matt", lastName: "Schlosser"}, 
                    {id: 2, firstName: "Connor", lastName: "Clark"}]
        res.render("household", {household: row, roomates:roommates, user: user});
    })
    
});

//update household
//delete household

app.get("/roommate/:id", function(req, res) {
    // view an individual within a household-
    // we need to check that they belong to a same household as user?
    // first we need the set of roomates with the current user
    let query = "with validHouseholds(h) as (select households.household from households natural join roommates where roommates.user = ?) select * from roommates natural join households natural join users where roommates.user = ?  and households.household in (select * from  validHouseholds);";
    db.get(query, [user.id, req.params.id], (err, roommate) => {
        if (!roommate) {
            console.log(roommate);
            res.send("Roommate not found!");
        } else {        
            household = {id: 1, name: "HMS Hamster", street: "11151 78 Ave NW", city: "Edmonton, AB"};
            //roommate = {id: 1, firstName: "Matt", lastName: "Schlosser"};
            console.log(roommate);
            res.render("roommate", {roommate: roommate, user: user});      
        }
    })
});





app.get("/rent", function(req, res) {
    // get and send rent data
    console.log('Inside GET /authrequired callback')
    console.log(`User authenticated? ${req.isAuthenticated()}`)
  //  if(req.isAuthenticated()) {
    rent = {amount: 450.00, due: new Date('2019-02-01T12:00:00'), paid: false};
    utilities = {amount: 56.32, due: new Date('2019-02-01T12:00:00'), paid: false};
    res.render("rent", {rent: rent, utilities: utilities});
 
});

app.get("/*", function(req, res) {
    res.redirect('/');
});

app.listen(8080);