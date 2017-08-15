const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');
const stripe = require('stripe');
const bodyParser = require('body-parser');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

function getTodos() {
    const ref = firebaseApp.database().ref('todo');
    return ref.once('value').then(snap => snap.val());
};

function postTodos(value) {
    const ref = firebaseApp.database().ref('todo');
    ref.push({
        text: value
    });
};

const app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');


app.get('/', (req, res) => {
    getTodos().then(todos => {
        res.render('index', { todos });
    });
});

app.post('/post', urlencodedParser, (req, res) => {
    var test = req.body.value
    postTodos(test);
    getTodos().then(todos => {
        res.render('index', { todos });
    });
});
   




exports.app = functions.https.onRequest(app);