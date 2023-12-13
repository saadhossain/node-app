const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const routes = require('./src/routes/index');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initiate database connection
mongoose.connect('mongodb+srv://vaidehi:odnYqpfy1opJHgeS@cluster0.lkawdhu.mongodb.net/?retryWrites=true&w=majority').then(() => {
    console.log("Database connection successful");
});
// Define an anonymous function to handle errors
mongoose.connection.on('error', (error) => console.error(error));
mongoose.Promise = global.Promise;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
}));

app.use(flash());
app.use((req, res, next) => {
    // Log request details for debugging
    console.log(req.method + " " + req.url, req.body);
    next();
})
// Use the routes module

app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
