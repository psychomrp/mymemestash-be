// imports
const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');
const multer = require('multer');

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('files[]', 10);

// plugins
app.use(cors({
    allowedHeaders: ['Authorization', 'Content-Type'],
    exposedHeaders: ['X-Custom-Header'],
}));
app.use(upload);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/', routes);

// run
app.listen(3000, () => {
    console.log('Running Express on 3000');
});