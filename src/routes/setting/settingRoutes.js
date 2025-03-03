const express = require('express');
const router = express.Router();
const { authAdminSetting } = require('../../middleware/auth/authAdmin');
const { getAllDataTypeSql, addDataTypeSql, updateDataTypeSql, removeDataTypeSql } = require('../../controllers/setting/typeSqlController'); // require SettingController
const { getAllDataPatientServices, addDataPatientServices, updateDataPatientServices, removeDataPatientServices } = require('../../controllers/setting/patientServicesController'); // require SettingController

// @ENDPOINT = http://localhost:3715/api_m/
router.get('/typeSql', authAdminSetting, getAllDataTypeSql);
router.post('/addTypeSql', authAdminSetting, addDataTypeSql);
router.put('/updateTypeSql/:id', authAdminSetting, updateDataTypeSql);
router.delete('/removeTypeSql/:id', authAdminSetting, removeDataTypeSql);

// @ENDPOINT = http://localhost:3715/api_m/
router.get('/patientServices', authAdminSetting, getAllDataPatientServices);
router.post('/addPatientServices', authAdminSetting, addDataPatientServices);
router.put('/updatePatientServices/:id', authAdminSetting, updateDataPatientServices);
router.delete('/removePatientServices/:id', authAdminSetting, removeDataPatientServices);

module.exports = router;