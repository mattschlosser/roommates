const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session'); 

var app = express();

app.use(session({
    genid: (req) => {
      console.log('Inside the session middleware')
      console.log(req.sessionID)
      return uuid() // use UUIDs for session IDs
    },
    secret: 'hippo idk',
    resave: false,
    saveUninitialized: true
  }))

var user = {id: 1, firstName: "Matt", lastName: "Schlosser"};
var household = {id: 1, name: "HMS Hamster"};
var chores = [{id: 1, firstName: "Matt", lastName: "Schlosser", chore: "do the dishes"},
         {id: 2, firstName: "Connor", lastName: "Clark", chore: "clean the bathroom"},
         {id: 3, firstName: "Cameron", lastName: "Clark", chore: "sweep the floors"},
         {id: 4, firstName: "Daniel", lastName: "Clark", chore: "being cool"}];
var groceries = [{id: 1, firstName: "Matt", lastName: "Schlosser", item: "bananas"},
                 {id: 2, firstName: "Connor", lastName: "Clark", item: "brocolli"}]

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    console.log(req.sessionID)
    res.render("home");
})

app.get("/register", function(req, res) {
    res.render("register");
});

app.get("/login", function(req, res) {
    res.render("login");
})

app.post("/login", function(req, res) {
    // do something
    console.log(req.body);
    res.send("Done");
})

app.get("/chores", function(req, res) {
    // get chores for user and send to the thing
    res.render("chores", {user: user, household: household, chores: chores});
});

app.get("/groceries", function(req, res) {
    // get the grocery list and display to user
    res.render("groceries", {user: user, household: household, groceries: groceries})
});

app.get("/household/:id", function(req, res) {
    // view an individual household
    // do some seelct based on req.params.id... say we get:
    household = {id: 1, name: "HMS Hamster", street: "11151 78 Ave NW", city: "Edmonton, AB"};
    roommates = [{id: 1, firstName: "Matt", lastName: "Schlosser"}, 
                {id: 2, firstName: "Connor", lastName: "Clark"}]
    res.render("household", {household: household, user: user});
});

app.get("/household/mew", function(req, res) {
    // Make a new household
    res.render("addHousehold", {user: user})
});

app.get("/households", function(req, res) {
    // manage households;
    households = [{id: 1, name: "HMS Hamster", street: "11151 78 Ave NW", city: "Edmonton, AB"}];
    res.render("households", {user: user, households: households});
});

app.get("/rent", function(req, res) {
    // get and send rent data
    rent = {amount: 450.00, due: new Date('2019-02-01T12:00:00'), paid: false};
    utilities = {amount: 56.32, due: new Date('2019-02-01T12:00:00'), paid: false};
    res.render("rent", {rent: rent, utilities: utilities});
});

app.listen(8080);