// imports
const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');

// plugins
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// routes
app.use('/', routes);

// run
app.listen(3000, () => {
    console.log('Running Express on 3000');
});