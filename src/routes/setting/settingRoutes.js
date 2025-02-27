const express = require('express');
const router = express.Router();
const { authCheckToken } = require('../../middleware/auth/authAdmin');
const { getAlldataTypeSql, addDataTypeSql, updateDataTypeSql, removeDataTypeSql } = require('../../controllers/setting/typeSqlController'); // require SettingController

// @ENDPOINT = http://localhost:3715/api_m/
router.get('/typeSql', authCheckToken, getAlldataTypeSql);
router.post('/addTypeSql', authCheckToken, addDataTypeSql);
router.put('/updateTypeSql/:id', authCheckToken, updateDataTypeSql);
router.delete('/removeTypeSql/:id', authCheckToken, removeDataTypeSql);

module.exports = router;