const express = require('express');
const router = express.Router();
const auth = require('./controllers/Auth')

// Index
router.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'myMemeStash',
        version: 1
    })
});

// Auth
router.post('/login', auth.login);

module.exports = router;
