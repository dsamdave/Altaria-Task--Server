



import express from 'express'
import auth from '../middleware/auth'
import userCtrl from '../contollers/userCtrl'


const router = express.Router()

router.put('/basic-information/:patientID', auth, userCtrl.upsertBasicInformation);
router.put('/health-metrics/:patientID', auth, userCtrl.upsertHealthMetrics);
router.put('/condition/:patientID/:conditionID?', auth, userCtrl.upsertCondition);

router.put('/treatment-history/:patientID/:treatmentID?', auth, userCtrl.upsertTreatmentHistory);
router.put('/medication/:patientID/:type/:medicationID?', auth, userCtrl.upsertMedication);
// Payload for General Medication (type = general):
// Payload for Advanced Medication (type = advanced):
router.put('/lab-results/:patientID/:labResultID?', auth, userCtrl.upsertLabResult);

router.put('/immunization/:patientID/:immunizationID?', auth, userCtrl.upsertImmunization);
router.put('/clinical-vitals/:patientID/:vitalID?', auth, userCtrl.upsertClinicalVitals);
router.put('/allergies/:patientID/:allergyID?', userCtrl.upsertAllergy);
router.get('/allergies/:patientID', userCtrl.getAllergies);






export default router