var express = require('express');
var app = express();
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
    res.render("home");
})

app.get("/register", function(req, res) {
    res.render("register");
});

app.get("/chores", function(req, res) {
    // get chores for user and send to the thing
    res.render("chores", {user: user, household: household, chores: chores});
});

app.get("/groceries", function(req, res) {
    // get the grocery list and display to user
    res.render("groceries", {user: user, household: household, groceries: groceries})
});

app.get("/households", function(req, res) {
    // manage households;
    res.render("household", {user: user, household: household});
});

app.get("/rent", function(req, res) {
    // get and send rent data
    rent = {amount: 450.00, due: new Date('2019-02-01T12:00:00'), paid: false};
    utilities = {amount: 56.32, due: new Date('2019-02-01T12:00:00'), paid: false};
    res.render("rent", {rent: rent, utilities: utilities});
});

app.listen(8080);