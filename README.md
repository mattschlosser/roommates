# Roomm8s (Roommates)

Manage common things between roommates, like whose turn it is to do the
 dishes, share grocery lists, and easily split rent costs. This app was an entry in the HackED 2019 hackathon. 
 
 I still work on this from time to time. 
 
 A demo version is available at https://roomm8s.mattschlosser.me/
 
## Install and setup for your own server

You must configure a SECRET in a `.env` file and populate the database first

```
# schema
sqlite3 my.db <  db.sql
# test data
sqlite3 my.db < export.sql
```

Then install and run
```
npm install
node app.js
```

visit [http://localhost:8080/](http://localhost:8080)

or with Docker
```
docker-compose up 
```
