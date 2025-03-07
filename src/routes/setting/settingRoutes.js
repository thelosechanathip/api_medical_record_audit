const express = require('express');
const router = express.Router();
const { authAdminSetting } = require('../../middleware/auth/authAdmin');
const { getAllDataTypeSql, addDataTypeSql, updateDataTypeSql, removeDataTypeSql } = require('../../controllers/setting/typeSqlController'); // require SettingController
const { getAllDataPatientServices, addDataPatientServices, updateDataPatientServices, removeDataPatientServices } = require('../../controllers/setting/patientServicesController'); // require SettingController
const { getAllDataContentOfMedicalRecord, addDataContentOfMedicalRecord, updateDataContentOfMedicalRecord, removeDataContentOfMedicalRecord } = require('../../controllers/setting/contentOfMedicalRecordsController'); // require SettingController
const { getAllDataOverallFinding, addDataOverallFinding, updateDataOverallFinding, removeDataOverallFinding } = require('../../controllers/setting/overallFindingController'); // require SettingController
const { getAllDataReviewStatus, addDataReviewStatus, updateDataReviewStatus, removeDataReviewStatus } = require('../../controllers/setting/reviewStatusController'); // require SettingController
const { getAllDataReviewStatusComment, addDataReviewStatusComment, updateDataReviewStatusComment, removeDataReviewStatusComment } = require('../../controllers/setting/reviewStatusCommentController'); // require SettingController

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

// @ENDPOINT = http://localhost:3715/api_m/
router.get('/contentOfMedicalRecord', authAdminSetting, getAllDataContentOfMedicalRecord);
router.post('/addContentOfMedicalRecord', authAdminSetting, addDataContentOfMedicalRecord);
router.put('/updateContentOfMedicalRecord/:id', authAdminSetting, updateDataContentOfMedicalRecord);
router.delete('/removeContentOfMedicalRecord/:id', authAdminSetting, removeDataContentOfMedicalRecord);

// @ENDPOINT = http://localhost:3715/api_m/
router.get('/overallFinding', authAdminSetting, getAllDataOverallFinding);
router.post('/addOverallFinding', authAdminSetting, addDataOverallFinding);
router.put('/updateOverallFinding/:id', authAdminSetting, updateDataOverallFinding);
router.delete('/removeOverallFinding/:id', authAdminSetting, removeDataOverallFinding);

// @ENDPOINT = http://localhost:3715/api_m/
router.get('/reviewStatus', authAdminSetting, getAllDataReviewStatus);
router.post('/addReviewStatus', authAdminSetting, addDataReviewStatus);
router.put('/updateReviewStatus/:id', authAdminSetting, updateDataReviewStatus);
router.delete('/removeReviewStatus/:id', authAdminSetting, removeDataReviewStatus);

// @ENDPOINT = http://localhost:3715/api_m/
router.get('/reviewStatusComment', authAdminSetting, getAllDataReviewStatusComment);
router.post('/addReviewStatusComment', authAdminSetting, addDataReviewStatusComment);
router.put('/updateReviewStatusComment/:id', authAdminSetting, updateDataReviewStatusComment);
router.delete('/removeReviewStatusComment/:id', authAdminSetting, removeDataReviewStatusComment);

module.exports = router;