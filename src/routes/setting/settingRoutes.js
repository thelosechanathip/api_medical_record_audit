const express = require('express');
const router = express.Router();
const { getAlldataTypeSql, addDataTypeSql, updateDataTypeSql, removeDataTypeSql } = require('../../controllers/setting/typeSqlController'); // require SettingController

// @ENDPOINT = http://localhost:3715/api_m/
router.get('/typeSql', getAlldataTypeSql);
router.post('/addTypeSql', addDataTypeSql);
router.put('/updateTypeSql/:id', updateDataTypeSql);
router.delete('/removeTypeSql/:id', removeDataTypeSql);

module.exports = router;