const path = require('path');
const express = require('express');
const session = require('express-session');
const store = new session.MemoryStore();
//Express-handlebars
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const route = require('./route/index');
global.serverAPI = "http://localhost:8088/";

//
const app = express();
const port = 3000;
var temp =[];
for(var i=1; i<7; i++){
    var currentDate = new Date(new Date().getTime() + i*(24 * 60 * 60 * 1000));
    var day = currentDate.getDate()
    var month = currentDate.getMonth() + 1
    var year = currentDate.getFullYear()
    var t = year+'-'+month+'-'+day;    
    temp.push(t);                                                                                
}
global.week = temp;
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    store,
}));
//config handlebars
app.engine('hbs', handlebars({
    extname: ".hbs"
}  
));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resourses','view'));

//Apply middeware
app.use(express.urlencoded({
    extended:true
}))
app.use(express.json());
//Basic route
route(app);
app.listen(port, ()=>{
    console.log(`Server is listen in ${port}`);
})