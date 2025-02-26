const express = require('express');
const router = express.Router();
const { getAlldataTypeSql, addDataTypeSql, updateDataTypeSql, removeDataTypeSql } = require('../../controllers/setting/typeSqlController'); // require SettingController

// @ENDPOINT = http://localhost:3715/api_m/
router.get('/typeSql', getAlldataTypeSql);
router.post('/typeSql', addDataTypeSql);
router.put('/typeSql/:id', updateDataTypeSql);
router.delete('/typeSql/:id', removeDataTypeSql);

module.exports = router;