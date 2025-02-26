const express = require('express');
const router = express.Router();
const { removeDataLog } = require('../../controllers/log/logController');

router.delete('/clearLog', removeDataLog)

module.exports = router;