const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session'); 
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


var users = [{id: 16, email: "websitemakingguy@gmail.com", firstName: "Matt", lastName: "Schlosser", password: "1234", household: 1}];
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

app.get('/', function(req, res) {
    // render the home page
    res.render("home/home");
})

app.get("/register", function(req, res) {
    res.render("auth/register");
});

app.get("/login", function(req, res) {
    res.render("auth/login");
})

app.post("/login", function(req, res, next) {
    // do something
    passport.authenticate('local', (err, user, info) => {
        req.login(user, (err) => {
          return res.send('You were authenticated & logged in!\n');
        })
      })(req, res, next);
})

// create chores
app.get("/chore/new", function(req, res) {
    // add a new chore
    db.get("SELECT * FROM households where households.household = ?;" [user.household], (err, household)=> {
        db.all("SELECT * FROM roommates natural join users where roommates.household = ?", [user.household], (err, roommates) => {
            res.render("chores/addChore", {user: user, household: household, roommates: roommates});
        });
    });
});

// create chores
app.post("/chores", function(req, res) {
    newChore = req.body;
        db.run("INSERT INTO chores(household,user,task) values(?,?,?);", [user.household, newChore.person, newChore.name], (err) => {
        console.log(err);
    })
    res.redirect("/chores");
})

// read chores
app.get("/chores", function(req, res) {
    // get chores for user and send to the thing
    db.get("SELECT * FROM households where households.household = ?", [user.household], (err, household) => {
        db.all("SELECT * FROM chores natural join users natural join roommates where roommates.household = ? ", [user.household], (err, chores) => {
            console.log(chores);    
            res.render("chores/chores", {user: user, household: household, chores: chores});
        })    
    })
    
});


// update chore
app.post("/chore/:id", function(req, res) {
    // lets just assume we are marking it as done
    
    db.run("UPDATE chores SET done = 1 where id = ?;", [req.params.id], (err) => {
        if (err) console.log(err);
    });
    res.redirect("/chores");
});

// delete chore
app.delete("/chore/:id", function(req, res) {
    // TODO auth user
    db.run("DELETE FROM chores WHERE id = ?;", [req.params.id], (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(202);
        } else {
            res.sendStatus(200);
        }
    });
});

app.get("/groceries/new", function(req,res) {
    // oh ok    
    res.render("groceries/addGrocery");
});


// create groceries
app.post("/groceries", function (req,res) {
    console.log(req.body);
    items = req.body;
    db.run("INSERT INTO groceries(household,user,item) values(?,?,?);", [user.household, user.id, items.item    ], (err) => {
        console.log(err);
    })
    res.redirect("/groceries");
})

// read groceries
app.get("/groceries", function(req, res) {
    // get the grocery list and display to user
    var household;
    db.all("SELECT * FROM households WHERE households.household = ?;", [user.household], (err, row) => {
        household = row[0];
        db.all("SELECT * from groceries natural join users   where groceries.household = ?;", [user.household], (err, groceries) => {
     
            res.render("groceries/groceries", {user: user, household: household, groceries: groceries})
        })
    });


});

// update grocery item
app.post("/groceries/:id", function(req, res) {
    // lets just assume we are marking it as done
    console.log("hello");
    db.run("UPDATE groceries SET purchased = 1 where id = ?;", [req.params.id], (err) => {
        console.log(err);
    });
    res.redirect("/groceries");
});


// delete grocery item
app.delete("/groceries/:id", function(req, res) {
    // TODO auth user
    db.run("DELETE FROM groceries WHERE id = ?;", [req.params.id], (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(202);
        } else {
            res.sendStatus(200);
        }
    });
});

// create household
app.get("/household/new", function(req, res) {
    // Make a new household
    res.render("households/addHousehold", {user: user})
});
app.post("/households", function(req,res,next) {
    // TODO auth user

    household = req.body;
    // TODO check params passed. 

    // insert into DB
    query = "INSERT INTO households(name,street,city) values(?,?,?);" 
    db.run(query, [household.name, household.street, household.city], (err) => {
        console.log(err);
    })
    res.redirect("/households");
})

// read households


app.get("/household", function(req, res) {
    // list households;
    households = [{id: 1, name: "HMS Hamster", street: "11151 78 Ave NW", city: "Edmonton, AB"}];
    db.get("SELECT * FROM households where household = ?;", [user.household], (err, household) => {
        db.all("SELECT * FROM roommates natural join users where roommates.household = ?", [user.household], (err, roommates) => {
            res.render("households/house", {user: user, household: household, roommates: roommates});
        });
    })
    
});

app.get("/households", function(req, res) {
    // list households;
    households = [{id: 1, name: "HMS Hamster", street: "11151 78 Ave NW", city: "Edmonton, AB"}];
    db.get("SELECT * FROM households where household = ?;", [user.household], (err, household) => {
        res.render("households/households", {user: user, household: household});
    })
    
});

// read household
app.get("/household/:id", function(req, res) {
    // view an individual household
    // do some seelct based on req.params.  id... say we get:
    db.get("SELECT household,name,street,city FROM households WHERE household = ?;", [req.params.id], (err, row) =>{
        
        roommates = [{id: 1, firstName: "Matt", lastName: "Schlosser"}, 
                    {id: 2, firstName: "Connor", lastName: "Clark"}]
        res.render("households/household", {household: row, roomates:roommates, user: user});
    })
    
});

//update household
//delete household
app.delete("/household/:id", function(req, res){
    // TODO auth user
    query = "DELETE FROM households WHERE id = ?;";
    db.run(query, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(202);
        } else {
            res.sendStatus(200);
        }
    });
});

app.post("/roommates", function(req, res) {
    let person = req.body;
    db.run("INSERT INTO users(firstName, lastName, email, password) values(?,?,?,?);", [person.firstName, person.lastName, person.email, 0], function (err) {
        if (err) console.log(err);
        console.log(this.lastID);
        db.run("INSERT into roommates(household, user) values(?,?)", [user.household, this.lastID], (err) => {
            if (err) console.log(err);
        });
    });
    res.redirect("/household"); 
})

// create
app.get("/roommate/new", function(req, res) {
    res.render("roommates/addRoommate", {user: user});
})
// read
app.get("/roommate/:id", function(req, res) {
    // view an individual within a household-
    // we need to check that they belong to a same household as user?
    // first we need the set of roomates with the current user
    let query = "with validHouseholds(h) as (select households.household from households natural join roommates where roommates.user = ?) select * from roommates natural join households natural join users where roommates.user = ?  and households.household in (select * from  validHouseholds);";
    db.get(query, [user.id, req.params.id], (err, roommate) => {
        if (!roommate) {
            console.log(roommate);
            res.statusCode(404);
            res.send("Roommate not found!");
            res.end();
        } else {
            query = "SELECT * FROM households WHERE households.household = ? ";        
            db.get(query, [user.household], (err, household) => {
                res.render("roommates/roommate", {roommate: roommate, user: user});       
            });
            //roommate = {id: 1, firstName: "Matt", lastName: "Schlosser"};
            console.log(roommate);
        }
    })
});
// update
// destroy
app.delete("/roommate/:id", function(req, res){
    // TODO auth user
    db.run("DELETE FROM roommates WHERE user = ?;", [req.params.id], (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(202);
        } else {
            res.sendStatus(200);
        }
    });
});

// create rent
app.get("/rent/new", (req, res) => {
    res.render("rent/addRent");
})
app.post("/rent", (req, res) => {
    // TODO auth user
    utility = req.body;
    // TODO check params
    query = "INSERT INTO utilities (household, utility, amount) values (?, ?, ?);"
    db.run(query, [user.household, utility.name, utility.value], (err) => {
        console.log("Error creating rent: ");
        console.log(err);
    });
    res.redirect("/rent")

});


// read rent
app.get("/rent", function(req, res) {
    // get and send rent data
    console.log('Inside GET /authrequired callback')
    console.log(`User authenticated? ${req.isAuthenticated()}`)
  //  if(req.isAuthenticated()) {
    query = "SELECT * FROM utilities WHERE household = ?;";
    db.all(query, [user.household], (err, utilities) => {
        if (err) {
            console.log(err);
        }
        rent = {amount: 450.00, due: new Date('2019-02-01T12:00:00'), paid: false};
        split = 7;
        console.log(utilities);
        res.render("rent/rent", {rent: rent, utilities: utilities, split: split})
    })
    // utilities = [{utility: "Internet", amount: 56.32, due: new Date('2019-02-01T12:00:00'), paid: false},
    // {utility: "Water/Electric", amount: 41.32, due: new Date('2019-02-01T12:00:00'), paid: false},
    // {utility: "Gas", amount: 15.32, due: new Date('2019-02-01T12:00:00'), paid: false}];
    // split = 7;
    // res.render("rent", {rent: rent, utilities: utilities, split: split});
 
});

// read rent
// update rent
// delete rent - if only everyone could do this...

app.get("/*", function(req, res) {
    res.redirect('/');
});

app.listen(8080);
