const express = require('express');
const { hello, secretSantaResult } = require('../controllers/santaController');
const router = express.Router();
const upload = require('../utils/upload');

router.get('/', hello);
router.post(
    '/secret-santa',
    upload.fields([
        { name: 'employeeList', maxCount: 1 },
        { name: 'lastYearList', maxCount: 1 },
    ]),
    secretSantaResult
);

module.exports = router;
